# 🌌 AURA OS 
**Autonomous Restaurant Operations & Intelligence System**

AURA OS is a next-generation enterprise platform designed for high-scale restaurant logistics. Built with the 2026 bleeding-edge stack, it focuses on "Inventory Friction" reduction and autonomous supply chain management.

## 🛠 Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL
- **ORM:** Prisma 7 (with Driver Adapters)
- **Runtime:** Node.js 22 (ESM)
- **Styling:** Tailwind CSS 4

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/aura_db"
```

### 3. Database Initialization
```bash
npx prisma generate
npx tsx prisma/seed.mts
```

### 4. Run Development Server
```bash
npm run dev
```

## 📈 Features
- **Real-time Inventory Tracking:** Zero-latency stock updates using Prisma 7.
- **Predictive Analytics:** Analyzes "Inventory Friction" to automate ordering.
- **Autonomous Seeding:** Rapid multi-location deployment via ESM-optimized scripts.

