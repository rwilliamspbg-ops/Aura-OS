import { NextResponse } from "next/server";
import { deductStockFromSale } from "@/lib/db/inventory-engine";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
  const { menuItemId, locationId, totalAmount } = await req.json();

  try {
    // 1. Create the Order Record
    const order = await prisma.order.create({
      data: {
        totalAmount,
        locationId,
        items: { connect: { id: menuItemId } }
      }
    });

    // 2. Execute the Perpetual Inventory Deduction
    await deductStockFromSale(menuItemId, locationId);

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
