import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/db/prisma";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateAutoPO(locationId: string) {
  // 1. Find all items below Par Level
  const lowStockItems = await prisma.inventoryItem.findMany({
    where: {
      locationId,
      currentStock: { lte: prisma.inventoryItem.fields.parLevel }
    }
  });

  if (lowStockItems.length === 0) return "All stock levels healthy.";

  // 2. Draft the AI Prompt
  const prompt = `
    You are the AURA OS Procurement Agent. 
    Analyze these low-stock items for Restaurant ID ${locationId}:
    ${JSON.stringify(lowStockItems)}
    
    Task: Create a professional Purchase Order draft.
    Include: Suggested order quantities (to reach 2x Par Level), 
    estimated costs, and a formal email body addressed to the Supplier.
    Format: JSON { poNumber, items: [{name, orderQty, unit}], emailDraft }
  `;

  // 3. Generate with Gemini 2.5 Flash
  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  
  return JSON.parse(result.response.text());
}
