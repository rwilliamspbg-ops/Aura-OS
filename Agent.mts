npm install dotenv
import { PrismaClient } from './prisma/generated/index.js';
import pkg from 'pg';
const { Pool } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';

// Initialize Database Connection
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function monitorInventoryFriction() {
  console.log('🔍 AURA OS: Scanning inventory for friction...');
  
  try {
    const lowStockItems = await prisma.inventoryItem.findMany({
      where: {
        // This logic compares current stock against the item's specific par level
        currentStock: { lte: 10 } 
      },
      include: { location: true }
    });

    if (lowStockItems.length === 0) {
      console.log('✅ All stock levels nominal.');
      return;
    }

    lowStockItems.forEach(item => {
      console.log(`\x1b[31m[ALERT]\x1b[0m Friction at ${item.location?.name}: ${item.name} (${item.currentStock} ${item.unit}) is below par!`);
    });
  } catch (error) {
    console.error('❌ Agent Error:', error);
  }
}

// Execution Loop
monitorInventoryFriction();
setInterval(monitorInventoryFriction, 60000); // Scans every 60 seconds
