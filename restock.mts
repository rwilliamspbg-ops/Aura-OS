import 'dotenv/config';
import { PrismaClient } from './prisma/generated/index.js';
import pkg from 'pg';
const { Pool } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';

// Use the environment variable or fallback to the local host port we found (5433)
const connectionString = process.argv.find(arg => arg.includes('postgresql://')) 
                         || "postgresql://postgres:password@127.0.0.1:5433/aura_db?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function restock(itemName: string, amount: number) {
  try {
    console.log(`📡 Connecting to DB at ${connectionString.split('@')[1]}...`);
    
    const result = await prisma.inventoryItem.updateMany({
      where: { 
        name: { contains: itemName, mode: 'insensitive' } 
      },
      data: { 
        currentStock: { increment: amount } 
      }
    });

    if (result.count > 0) {
      console.log(`✅ Success: Added ${amount} to "${itemName}" (Modified ${result.count} records).`);
    } else {
      console.log(`⚠️ Item "${itemName}" not found.`);
    }
  } catch (e) {
    console.error("❌ Failed to restock:", e);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

const [,, name, qty] = process.argv;
if (!name || !qty) {
  console.log("Usage: npx tsx restock.mts \"Item Name\" 50");
} else {
  restock(name, parseInt(qty));
}
