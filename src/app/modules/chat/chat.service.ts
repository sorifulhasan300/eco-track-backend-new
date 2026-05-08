import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../../../config/config";
import { prisma } from "../../../lib/prisma";

const genAI = new GoogleGenerativeAI(config.gemini.apiKey as string);

const chatWithInventory = async (userMessage: string) => {
  const productSummary = await prisma.product.findMany({
    select: {
      title: true,
      price: true,
      stockLevel: true,
      category: true,
    },
    take: 10,
  });

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an AI Inventory Assistant for "Eco-Track". 
    Here is the current inventory data: ${JSON.stringify(productSummary)}
    
    User Question: "${userMessage}"
    
    Guidelines:
    - Be professional and concise.
    - If someone asks about stock, look at the provided data.
    - If the answer isn't in the data, tell them you can only assist with current inventory details.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

export const ChatServices = {
  chatWithInventory,
};
