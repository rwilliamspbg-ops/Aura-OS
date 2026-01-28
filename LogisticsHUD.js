import React, { useState, useEffect } from 'react';

const LogisticsHUD = () => {
  // Simulating live data from your Backend Engine
  const [telemetry, setTelemetry] = useState({
    friction: "0.042 ms",
    nodes: "4",
    status: "Optimal"
  });

  return (
    <div className="min-h-screen bg-[#050505] text-cyan-50 p-6 font-mono">
      {/* Top Telemetry Bar */}
      <div className="flex justify-between border-b border-cyan-900/50 pb-2 mb-6 text-[10px] tracking-widest uppercase">
        <span>System: Aura-OS v1.0.4</span>
        <span className="text-cyan-400">Status: {telemetry.status}</span>
        <span>Node_ID: {Math.random().toString(36).substring(7)}</span>
      </div>

      {/* Main Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Inventory Friction Card */}
        <div className="bg-cyan-950/10 border border-cyan-500/20 p-4 rounded shadow-[0_0_15px_rgba(6,182,212,0.05)]">
          <p className="text-[10px] text-cyan-700 uppercase">Inventory Friction</p>
          <p className="text-3xl font-bold text-white mt-1">{telemetry.friction}</p>
          <div className="h-1 bg-cyan-900/30 mt-4 overflow-hidden">
            <div className="h-full bg-cyan-500 w-1/3 animate-pulse"></div>
          </div>
        </div>

        {/* Active Logistics Mesh */}
        <div className="md:col-span-2 bg-black border border-cyan-500/10 p-4 relative overflow-hidden h-64">
           <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
           <p className="relative z-10 text-[10px] text-cyan-700 uppercase">Live Logistics Mesh</p>
           <div className="flex items-center justify-center h-full">
              <span className="text-cyan-500 animate-pulse text-xs uppercase tracking-[0.5em]">Tracking Autonomous Seeding...</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsHUD;
