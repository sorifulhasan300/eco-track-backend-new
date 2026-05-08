import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../../config/config.js";

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

export const generateProductMetadata = async (
  title: string,
  description: string,
) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Analyze the following product:
    Title: ${title}
    Description: ${description}

    Please provide a response in strictly JSON format with the following keys:
    1. "shortDesc": A catchy summary (max 15 words).
    2. "tags": An array of 5 relevant string tags.
    
    Return ONLY the JSON object.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const cleanJson = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanJson);
};
