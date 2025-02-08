import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  maxOutputTokens: 30000,
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0,
});

export default llm;
