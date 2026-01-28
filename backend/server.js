const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { GoogleGenAI } = require("@google/genai"); // New 2026 Unified SDK

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// --- CONFIGURATION ---
const API_KEY = "AIzaSyC4-PC8sD5HKeZNJknfmkbR4TViau8EZVY".trim();
const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- SYSTEM STATE ---
let orderHistory = [];
let inventory = {
  "ribeye": 40,
  "salmon": 25,
  "draft_beer": 100,
  "burger_buns": 50
};

// --- AURA INTELLIGENCE LOGIC ---
const processAuraInsight = async (voiceText) => {
  try {
    const prompt = `
      Context: AURA OS Restaurant Intelligence.
      Current Inventory: ${JSON.stringify(inventory)}
      Recent History: ${JSON.stringify(orderHistory.slice(-5))}
      User Command: "${voiceText}"
      
      Task: If the user asks for metrics, stock, or status, provide a concise (1-sentence) military-grade briefing. 
      If they are firing an order, acknowledge it.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    return response.text;
  } catch (err) {
    return "AI_OFFLINE: CHECK_SDK_LINK";
  }
};

// --- SOCKET CONNECTION ---
io.on('connection', (socket) => {
  console.log('📡 Station Connected:', socket.id);
  socket.emit('history_load', orderHistory);

  socket.on('new_order', async (data) => {
    // 1. Log the message
    orderHistory.push(data);
    if (orderHistory.length > 50) orderHistory.shift();

    // 2. Broadcast to HUDs
    io.emit('order_update', data);

    // 3. If it's a "VOICE" command for the Manager/AI, process Insight
    if (data.type.startsWith("VOICE:") && data.target === "Manager") {
      const insight = await processAuraInsight(data.type);
      
      const aiResponse = {
        id: 'AI-' + Math.random().toString(36).substr(2, 4),
        role: 'AURA AI',
        target: 'All', // Everyone hears the AI briefing
        type: `INSIGHT: ${insight}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      io.emit('order_update', aiResponse);
    }
  });

  socket.on('disconnect', () => console.log('Station Offline'));
});

server.listen(3001, '0.0.0.0', () => {
  console.log('🚀 AURA OS BACKEND LIVE ON PORT 3001');
});
