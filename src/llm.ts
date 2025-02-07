import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  maxOutputTokens: 10000,
  apiKey: process.env.GEMINI_API_KEY,
  topP: 1,
});

export default llm;
