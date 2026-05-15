import { GoogleGenerativeAI } from "@google/generative-ai";
import { RESCUE_IQ_KNOWLEDGE } from "../config/ai_knowledge.js";

export const getAIResponse = async (req, res) => {
  try {
    const { prompt, history } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      return res.status(500).json({ error: "AI Uplink failed. Please provide a valid GEMINI_API_KEY in the .env file." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    if (!prompt) {
      return res.status(400).json({ error: "Transmission empty. Please provide a prompt." });
    }

    const model = genAI.getGenerativeModel({ 
        model: process.env.AI_MODEL_NAME || "gemini-1.5-flash",
        systemInstruction: RESCUE_IQ_KNOWLEDGE,
    });

    // Filter history: Gemini requires the first message to be from 'user'
    let cleanHistory = history || [];
    if (cleanHistory.length > 0 && cleanHistory[0].role === 'model') {
      cleanHistory = cleanHistory.slice(1);
    }

    const chat = model.startChat({
      history: cleanHistory,
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error("AI TRANSMISSION ERROR:", error);
    res.status(500).json({ 
        error: "AI Uplink failed. Please ensure your GEMINI_API_KEY is valid in the .env file.",
        details: error.message 
    });
  }
};
