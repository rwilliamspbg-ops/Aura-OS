import 'dotenv/config';
import { PrismaClient } from './prisma/generated/index.js';
import pkg from 'pg';
const { Pool } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const logPath = path.join(process.cwd(), 'restock.log');

// Memory to track alerts: { "ItemName_Location": Timestamp }
const alertTracker: Record<string, number> = {};
const ONE_HOUR = 60 * 60 * 1000;

function logEvent(message: string) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logPath, logEntry);
}

async function monitorInventoryFriction() {
  console.log('🔍 AURA OS: Scanning inventory...');
  try {
    const items = await prisma.inventoryItem.findMany({
      include: { location: true }
    });

    const now = Date.now();

    for (const item of items) {
      const itemKey = `${item.name}_${item.location?.name}`;
      
      // FRICTION DETECTION
      if (item.currentStock <= 10) {
        const lastAlert = alertTracker[itemKey] || 0;

        if (now - lastAlert > ONE_HOUR) {
          const alertMsg = `FRICTION ALERT: ${item.name} at ${item.location?.name} is low (${item.currentStock} ${item.unit} remaining).`;
          console.log(`\x1b[31m[ALERT]\x1b[0m ${alertMsg}`);
          logEvent(alertMsg);
          alertTracker[itemKey] = now; // Update throttle
        }
      } 
      // AUTO-RESOLUTION DETECTION
      else if (alertTracker[itemKey]) {
        const resolveMsg = `RESOLVED: ${item.name} at ${item.location?.name} has been restocked to ${item.currentStock} ${item.unit}.`;
        console.log(`\x1b[32m[FIXED]\x1b[0m ${resolveMsg}`);
        logEvent(resolveMsg);
        delete alertTracker[itemKey]; // Reset tracker so it can alert again if it drops later
      }
    }
  } catch (error) {
    console.error('❌ Agent Error:', error);
  }
}

monitorInventoryFriction();
setInterval(monitorInventoryFriction, 60000); // Check every minute, but alerts are throttled hourly
