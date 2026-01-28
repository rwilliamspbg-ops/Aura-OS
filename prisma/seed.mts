import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  // DYNAMIC IMPORT: This bypasses the static resolution errors
 import { PrismaClient } from './generated'

  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
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

  // 2. Create an Inventory Item
  await prisma.inventoryItem.upsert({
    where: { id: 'item_001' },
    update: {},
    create: {
      id: 'item_001',
      name: 'Prime Ribeye',
      currentStock: 5,
      parLevel: 10,
      unit: 'lbs',
      locationId: location.id,
    },
  });

console.log('✅ AURA OS: Seed complete!');
  await pool.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
