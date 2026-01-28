// src/components/features/InventoryGrid.tsx
import { prisma } from "@/lib/prisma";
import { AlertTriangle, Package, CheckCircle } from "lucide-react";

export async function InventoryGrid() {
  const items = await prisma.inventoryItem.findMany();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item) => {
        const isLow = item.currentStock <= item.parLevel;
        
        return (
          <div key={item.id} className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-lg ${isLow ? 'bg-red-100' : 'bg-blue-100'}`}>
                {isLow ? <AlertTriangle className="text-red-600" /> : <Package className="text-blue-600" />}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${isLow ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {isLow ? "FRICTION" : "STABLE"}
              </span>
            </div>
            <h3 className="mt-4 font-bold text-slate-800 text-lg">{item.name}</h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black">{item.currentStock}</span>
              <span className="text-slate-500 uppercase text-xs">{item.unit}</span>
            </div>
            <div className="mt-4 bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full ${isLow ? 'bg-red-500' : 'bg-blue-500'}`} 
                style={{ width: `${Math.min((item.currentStock / (item.parLevel * 2)) * 100, 100)}%` }} 
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

