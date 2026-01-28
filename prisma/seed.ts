import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // 1. Create a Default Restaurant Location
  const restaurant = await prisma.location.upsert({
    where: { id: 'default-loc-1' },
    update: {},
    create: {
      id: 'default-loc-1',
      name: 'Aura Flagship Kitchen',
      address: '123 Autonomous Way',
      status: 'ACTIVE',
    },
  })

  // 2. Create Initial Inventory Items
  await prisma.inventory.createMany({
    data: [
      { name: 'Organic Flour', quantity: 50, unit: 'kg', locationId: restaurant.id },
      { name: 'Tomato Sauce', quantity: 20, unit: 'L', locationId: restaurant.id },
    ],
    skipDuplicates: true,
  })

  // 3. System Configuration for the Agent
  await prisma.systemConfig.upsert({
    where: { key: 'AGENT_MODE' },
    update: {},
    create: {
      key: 'AGENT_MODE',
      value: 'AUTONOMOUS',
    },
  })

  console.log('✅ Seed complete: Created restaurant and initial inventory.')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
