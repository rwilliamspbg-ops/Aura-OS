// src/lib/station-logic.ts
import { PrismaClient, Role } from '../../prisma/generated';

const prisma = new PrismaClient();

export async function getStationContext(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { location: true }
  });

  if (!user) throw new Error("User not found");

  // Logic to determine station capabilities based on Role
  return {
    role: user.role,
    location: user.location?.name || "Global",
    canAdjustInventory: user.role === 'OWNER' || user.role === 'MANAGER',
    canViewRecipes: true, // All roles can view recipes in Aura-OS
    canManageStaff: user.role === 'OWNER'
  };
}
