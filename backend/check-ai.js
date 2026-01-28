const { GoogleGenAI } = require("@google/genai");

// Ensure your key is pasted here
const API_KEY = "AIzaSyC4-PC8sD5HKeZNJknfmkbR4TViau8EZVY".trim();
const ai = new GoogleGenAI({ apiKey: API_KEY });

async function verifyAura() {
  console.log("📡 AURA OS: Initializing Gemini 2.5 Flash [Unified SDK]...");
  try {
    // 2026 Stable Model: gemini-2.5-flash
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "AURA System Check: Respond with 'SYSTEM_OPERATIONAL_2026'"
    });

    console.log("✅ AI STATUS: LINK ESTABLISHED.");
    console.log("🤖 AURA RESPONSE:", response.text);
    
  } catch (error) {
    console.error("❌ AI LINK FAILED.");
    console.log("Detail:", error.message);
    
    if (error.message.includes("404")) {
        console.log("💡 Try fallback to gemini-2.0-flash...");
    }
  }
}

verifyAura();
