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

// Simple in-memory storage for chat history
const chatHistories = {};

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




    const systemPrompt = `You are Aruni, a senior loan advisor at TrustBank. 
Your tone is warm, professional, and empathetic. 

CUSTOMER INFO:
- Name: {user_name}
- Preferred Language: {preferred_language}

GREETING RULES:
1. Since you already introduced yourself in the onboarding, DO NOT say "Hi", "Hello", or "I am Aruni" in subsequent messages.
2. ALWAYS address the customer by their name ({user_name}) when appropriate to build trust.
3. Strictly stick to the customer's Preferred Language ({preferred_language}).

GENERAL RULES:
1. Only provide detailed tables or lists if specifically asked for detailed loan data.
2. If you don't know an answer based on the context, politely ask {user_name} to visit a TrustBank branch.

Conversation Context:
{context}

Chat History:
{chat_history}`;

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", systemPrompt],
        ["human", "{input}"],
    ]);

    const retriever = vectorStore.asRetriever();

    const chain = RunnableSequence.from([
        {
            context: (input) => retriever.invoke(input.input).then((docs) => {
                console.log(`Retrieved ${docs.length} documents for context`);
                return docs.map((d) => d.pageContent).join("\n\n");
            }),
            chat_history: (x) => x.chat_history,
            input: (x) => x.input,
            user_name: (x) => x.user_name,
            preferred_language: (x) => x.preferred_language,
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
    // For simplicity, using 'default' session. In production, use session IDs from headers/cookies.
    const sessionId = req.headers['x-session-id'] || 'default-session';
    const userName = req.headers['x-user-name'] || 'Customer';
    const preferredLanguage = req.headers['x-preferred-language'] || 'English';
    const { message } = req.body;

    console.log(`Received message from ${userName} (${sessionId}): "${message}"`);

    if (!ragChain) {
        return res.status(503).json({ error: "Service is still initializing" });
    }

    // Initialize or get history
    if (!chatHistories[sessionId]) {
        chatHistories[sessionId] = [];
    }

    try {
        // Format history for prompt
        const historyString = chatHistories[sessionId]
            .map(m => `${m.sender}: ${m.text}`)
            .join("\n");

        const response = await ragChain.invoke({
            input: message,
            chat_history: historyString,
            user_name: userName,
            preferred_language: preferredLanguage
        });

        console.log("Chain invoked successfully");

        // Update history (keep last 10 messages: 5 user + 5 AI)
        chatHistories[sessionId].push({ sender: 'User', text: message });
        chatHistories[sessionId].push({ sender: 'Aruni', text: response });

        if (chatHistories[sessionId].length > 10) {
            chatHistories[sessionId] = chatHistories[sessionId].slice(-10);
        }

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
