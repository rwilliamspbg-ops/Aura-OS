import { prisma } from "@/lib/db/prisma";

/**
 * Automatically deducts inventory based on a Menu Item sale.
 * Triggers low-stock alerts if items drop below Par Level.
 */
export async function deductStockFromSale(menuItemId: string, locationId: string) {
  return await prisma.$transaction(async (tx) => {
    // 1. Fetch the MenuItem and its linked Recipe + Ingredients
    const item = await tx.menuItem.findUnique({
      where: { id: menuItemId },
      include: {
        recipe: {
          include: {
            ingredients: true,
          },
        },
      },
    });

    if (!item || !item.recipe) throw new Error("Item or Recipe not found");

    const deductions = [];

    // 2. Loop through ingredients to prepare deductions
    for (const ing of item.recipe.ingredients) {
      const updatedItem = await tx.inventoryItem.update({
        where: { id: ing.inventoryItemId },
        data: {
          currentStock: {
            decrement: ing.quantity,
          },
        },
      });

      // 3. Logic: Check if we hit "Friction" (Low Stock)
      if (updatedItem.currentStock <= updatedItem.parLevel) {
        console.warn(`🚨 LOW STOCK ALERT: ${updatedItem.name} at ${locationId}`);
        // Here you could trigger a Gemini AI notification or a Pusher alert
      }
      
      deductions.push(updatedItem);
    }

    return deductions;
  });
}
