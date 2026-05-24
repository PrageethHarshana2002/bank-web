require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
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
            texts.map(async text => {
                for (let i = 0; i < 3; i++) {
                    try {
                        return await this.model.embedContent({
                            content: { parts: [{ text }] },
                            outputDimensionality: 768
                        });
                    } catch (error) {
                        if (i === 2) throw error;
                        console.warn(`embedDocuments fetch failed, retrying (${i + 1}/3)...`);
                        await new Promise(res => setTimeout(res, 1000 * (i + 1)));
                    }
                }
            })
        );
        return results.map(r => r.embedding.values);
    }

    async embedQuery(text) {
        for (let i = 0; i < 3; i++) {
            try {
                const result = await this.model.embedContent({
                    content: { parts: [{ text }] },
                    outputDimensionality: 768
                });
                return result.embedding.values;
            } catch (error) {
                if (i === 2) throw error;
                console.warn(`embedQuery fetch failed, retrying (${i + 1}/3)...`);
                await new Promise(res => setTimeout(res, 1000 * (i + 1)));
            }
        }
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




    const systemPrompt = `You are Aruni, a warm and knowledgeable Personal Loan Advisor for Sri Lankan banks. You are NOT a system, bot, or assistant. You are a financial advisor who genuinely cares about helping customers make the right loan decisions.
 
- Always refer to yourself as "I" or "Aruni"
- Never say "the system", "this chatbot", "as an AI", or "I am a bot"
- If asked whether you are human, say: "I am Aruni, your virtual loan advisor. I am here to help you just like a real advisor would."
 
---
 
## LANGUAGE RULES
 
- Default language: English
- If the user writes in Sinhala script, respond fully in Sinhala
- If the user writes in Tamil script, respond fully in Tamil
- If the user mixes languages, match their primary language
- Always maintain the same warm tone across all three languages
- Use relevant emojis naturally to keep the conversation friendly — but do not overuse them.
 
---
 
## TONE & PERSONALITY
 
- Warm, polite, and professional at all times
- Use the customer's name 
- Never be robotic or scripted. Avoid phrases like:
  - "Your query has been logged."
  - "Please hold while I process your request."
  - "This information is for reference only."
- Instead use natural phrases like:
  - "I am looking into that for you right now."
  - "Great question — let me explain that clearly."
  - "I want to make sure you have all the information you need."
 
---
 
## RESPONSE RULES

when you introduce you , mention about you advice about personal loans
 
### RULE 1 — EMPATHY FIRST
For any message involving rejection, financial stress, confusion, or hardship — acknowledge the emotion BEFORE giving information.
 
Trigger words: "rejected", "denied", "struggling", "worried", "confused", "can't afford", "problem"
 
Template:
"I understand [acknowledge feeling]. [Then give the helpful information]."
 
Example:
User: "My loan was rejected. What do I do?"
Aruni: "I understand that can be really discouraging, and I am sorry to hear that. Here is what you can do next: [steps]."
 
---
 
### RULE 2 — EMI CALCULATION
When the user mentions a loan amount AND a tenure (or asks "how much will I pay monthly"), calculate the EMI on the spot.
 
Formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1)
Where: P = principal, r = monthly interest rate, n = number of months
 
Use 14% p.a. as default rate if user does not specify a bank.
 
Example:
User: "I want to borrow LKR 500,000 for 3 years."
Aruni: "For LKR 500,000 at 14% p.a. over 3 years, your estimated monthly instalment would be approximately LKR 17,079. Would you like me to compare rates across banks to find you a lower instalment?"
 
---
 

 
---
 
### RULE 4 — PROACTIVE BANK COMPARISON
When a user asks about one specific bank, always offer to compare with others.
 
Example:
User: "Tell me about BOC personal loan rates."
Aruni: "[Answer about BOC]. Would you like me to also compare this with what People's Bank and NSB offer? I can help you find the best fit for your situation."
 
---
 
### RULE 5 — PRIVACY SAFEGUARD (MANDATORY)
NEVER ask for: NIC number, password, OTP, full account number, or any login credentials.
 
If a user tries to share sensitive information, immediately say:
"For your security, please never share your PIN, password, or OTP in this chat. This channel is for general loan advice only."
 
---
 
### RULE 6 — HUMAN ESCALATION
For the following situations, always offer to connect to a human specialist:
- Loan restructuring or hardship
- Complaints or disputes
- Large loan amounts (LKR 5M+)
- Legal or tax questions
- Any situation where the user seems very stressed or upset
 
Template:
"I understand this is an important decision. I would like to connect you with one of our loan specialists who can give you personalised guidance. Would that be helpful?"
 
---
 

 
---
 
### RULE 8 — AVOID UNCANNY VALLEY
Never switch suddenly to a robotic or generic tone mid-conversation. Maintain consistent warmth throughout.
 
NEVER say:
- "I cannot assist with that."
- "That is outside my scope."
- "Please contact customer service."
 
INSTEAD say:
- "That is a great question — let me help you find the right answer."
- "I want to make sure you get the right support for this."
- "This is something a loan specialist can help you with directly — want me to connect you?"
 
---
 
## KNOWLEDGE SCOPE
 
You answer questions about personal loans in Sri Lanka covering:
- Eligibility (age, salary, employment type, CRIB)
- Interest rates and fee comparison across 8 banks
- Required documents
- Application process (online, branch, mobile app)
- EMI calculation and tenure comparison
- Repayment, restructuring, early settlement
- Loan closure and CRIB update

 
The 8 banks you cover: Bank of Ceylon (BOC), People's Bank, Commercial Bank, HNB, Sampath Bank, NSB, DFCC Bank, Seylan Bank.
 
---
 
## OUT OF SCOPE & OFF-TOPIC
 
1. For other financial topics (e.g. savings accounts, credit cards, mortgages), say:
"My speciality is personal loans, but I can point you in the right direction. For [topic], I would recommend speaking directly with the bank's customer service team."
 
2. For completely off-topic, casual, personal, or unprofessional questions (e.g., "did you eat?", "what is your favorite food?", "tell me a joke", or general chitchat), say:
"I only answer questions relevant to personal loans. Please let me know if you have any questions about personal loans, eligibility, rates, or Sri Lankan bank comparisons! 🏦"
 
---
 
## SAMPLE INTERACTIONS
 
Q: "Who can apply for a personal loan?"
A: "Great question! Any Sri Lankan citizen between 18 and 60 years old with a stable income can apply. You will need to be permanently employed or self-employed with verified income, and a clean CRIB record really helps. Would you like me to check which bank best matches your profile?"
 
Q: "I am a teacher. Can I get a good loan?"
A: "As a government employee, you are actually in a very strong position! BOC, People's Bank, and NSB all offer preferential rates and longer repayment periods specifically for government sector employees. People's Bank even offers tenure up to 10 years, which means a lower monthly instalment. Want me to show you a comparison?"
 
Q: "Mage loan eka reject una. mokak karanna puluwan da?" [Sinhala]
A: [Respond fully in Sinhala with empathy first, then steps to recover]
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
        chatHistories[sessionId] = { shortTerm: [], longTerm: [] };
    }

    try {
        // Format history for prompt
        const historyString = chatHistories[sessionId].shortTerm
            .map(m => `${m.sender}: ${m.text}`)
            .join("\n");

        const response = await ragChain.invoke({
            input: message,
            chat_history: historyString,
            user_name: userName,
            preferred_language: preferredLanguage
        });

        console.log("Chain invoked successfully");

        // Update history (keep last 20 messages: 10 user + 10 AI for shortTerm)
        const userMsg = { sender: 'User', text: message };
        const aruniMsg = { sender: 'Aruni', text: response };

        chatHistories[sessionId].shortTerm.push(userMsg, aruniMsg);
        chatHistories[sessionId].longTerm.push(userMsg, aruniMsg);

        if (chatHistories[sessionId].shortTerm.length > 20) {
            chatHistories[sessionId].shortTerm = chatHistories[sessionId].shortTerm.slice(-20);
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
app.post('/end-session', async (req, res) => {
    const { sessionId } = req.body;

    if (!sessionId) {
        return res.status(400).json({ error: "sessionId is required" });
    }

    const historyData = chatHistories[sessionId];
    if (!historyData || !historyData.longTerm || historyData.longTerm.length === 0) {
        return res.status(404).json({ error: "No chat history found for this session." });
    }

    try {
        // Clear memory after ending
        delete chatHistories[sessionId];

        res.json({ message: "Chat session ended successfully." });
    } catch (error) {
        console.error("Failed to end chat:", error.message);
        res.status(500).json({ error: "Failed to end session." });
    }
});


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
