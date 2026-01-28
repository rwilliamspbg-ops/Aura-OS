import 'dotenv/config';
import pkg from 'pg';
import { PrismaClient } from './generated/index.js';
import { PrismaPg } from '@prisma/adapter-pg';

const { Pool } = pkg;

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  
  // Initialize Prisma with the Driver Adapter for Node 22 compatibility
  const prisma = new PrismaClient({ adapter });

  console.log('🌱 AURA OS: Starting seed...');

  // 1. Create a Location
  const location = await prisma.location.upsert({
    where: { id: 'loc_001' },
    update: {},
    create: {
      id: 'loc_001',
      name: 'The Burger Lab - Downtown',
    },
  });

  // 2. Create a User/Staff member
  await prisma.user.upsert({
    where: { id: 'user_001' },
    update: {},
    create: {
      id: 'user_001',
      role: 'STAFF',
      locationId: location.id,
    },
  });

  // 3. Create Inventory Items for "Inventory Friction" logic
  const inventoryItems = [
    { id: 'item_001', name: 'Prime Ribeye', currentStock: 5, parLevel: 10, unit: 'lbs' },
    { id: 'item_002', name: 'Brioche Buns', currentStock: 100, parLevel: 50, unit: 'units' },
    { id: 'item_003', name: 'Organic Flour', currentStock: 25, parLevel: 40, unit: 'kg' },
  ];

  for (const item of inventoryItems) {
    await prisma.inventoryItem.upsert({
      where: { id: item.id },
      update: {},
      create: {
        ...item,
        locationId: location.id,
      },
    });
  }

  // 4. Create a Recipe to connect Inventory and Orders
  const recipe = await prisma.recipe.upsert({
    where: { id: 'rec_001' },
    update: {},
    create: {
      id: 'rec_001',
      name: 'Signature Aura Burger',
      locationId: location.id,
      ingredients: {
        create: [
          {
            inventoryItemId: 'item_001',
            quantity: 0.5, // 0.5 lbs of Ribeye per burger
          }
        ]
      }
    },
  });

  console.log('✅ AURA OS: Seed complete! Database is connected and populated.');
  await pool.end();
}

main().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
