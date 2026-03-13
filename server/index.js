require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pinecone } = require('@pinecone-database/pinecone');
const { PineconeStore } = require('@langchain/pinecone');
const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { RunnableSequence, RunnablePassthrough } = require('@langchain/core/runnables');
const { Embeddings } = require('@langchain/core/embeddings');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Custom class to handle 768 dimensions until LangChain catches up
class GoogleEmbeddings768 extends Embeddings {
    constructor(fields) {
        super(fields);
        this.apiKey = fields.apiKey;
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    }

    async embedDocuments(texts) {
        const results = await Promise.all(
            texts.map(text => this.model.embedContent({
                content: { parts: [{ text }] },
                outputDimensionality: 768
            }))
        );
        return results.map(r => r.embedding.values);
    }

    async embedQuery(text) {
        const result = await this.model.embedContent({
            content: { parts: [{ text }] },
            outputDimensionality: 768
        });
        return result.embedding.values;
    }
}


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Initialize Pinecone
const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

async function initRAG() {
    const embeddings = new GoogleEmbeddings768({
        apiKey: process.env.GOOGLE_API_KEY,
    });

    const pineconeIndex = pc.Index(process.env.PINECONE_INDEX_NAME);


    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex,
    });

    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash-latest";
    console.log(`Using model: ${modelName}`);

    const model = new ChatGoogleGenerativeAI({
        model: modelName,
        apiKey: process.env.GOOGLE_API_KEY,
        temperature: 0.7,
    });




    const systemPrompt = `You are Aruni, a senior loan advisor. You are warm, professional, and empathetic. 
Use the provided bank data context to answer questions. If you don't know the answer, ask them to visit a branch.
Speak politely in English, Sinhala, or Tamil based on the user's message.

Context: 
{context}`;

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", systemPrompt],
        ["human", "{input}"],
    ]);

    const retriever = vectorStore.asRetriever();

    const chain = RunnableSequence.from([
        {
            context: retriever.pipe((docs) => {
                console.log(`Retrieved ${docs.length} documents for context`);
                return docs.map((d) => d.pageContent).join("\n\n");
            }),
            input: new RunnablePassthrough(),
        },
        prompt,
        model,
        new StringOutputParser(),
    ]);

    return chain;
}

let ragChain;
initRAG().then(chain => {
    ragChain = chain;
    console.log("RAG Chain initialized successfully");
}).catch(err => {
    console.error("Failed to initialize RAG Chain:", err);
});

app.post('/chat', async (req, res) => {
    const { message } = req.body;
    console.log(`Received message: "${message}"`);

    if (!ragChain) {
        return res.status(503).json({ error: "Service is still initializing" });
    }

    try {
        const response = await ragChain.invoke(message);
        console.log("Chain invoked successfully");
        res.json({ response });
    } catch (error) {
        console.error("Chat error details:", {
            message: error.message,
            stack: error.stack,
            status: error.status,
            statusText: error.statusText
        });

        if (error.status === 429 || error.message.includes("429")) {
            return res.status(429).json({
                error: "Aruni's brain is hitting a Google Free Tier limit. This is a temporary daily cap. Please try again in 1 minute, or switch to a different API key if you have one."
            });
        }

        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});




app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
