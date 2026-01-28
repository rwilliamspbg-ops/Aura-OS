import { LayoutDashboard, Receipt, Database, Settings } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r p-6 flex flex-col gap-8">
        <div className="text-2xl font-black tracking-tighter text-blue-600">AURA OS</div>
        <nav className="flex flex-col gap-2">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Overview" active />
          <NavItem icon={<Database size={20}/>} label="Inventory" />
          <NavItem icon={<Receipt size={20}/>} label="Orders" />
          <NavItem icon={<Settings size={20}/>} label="Settings" />
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-12">
        {children}
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}>
      {icon} {label}
    </div>
  );
}
