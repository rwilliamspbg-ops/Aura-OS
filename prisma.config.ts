import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "",
  },
  migrations: {
    // Point directly to the node_modules binary
    seed: "./node_modules/.bin/tsx prisma/seed.ts",
  },
});
