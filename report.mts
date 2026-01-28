import fs from 'fs';
import path from 'path';

const logPath = path.join(process.cwd(), 'restock.log');

function generateReport() {
  if (!fs.existsSync(logPath)) {
    console.log("No log file found.");
    return;
  }

  const logData = fs.readFileSync(logPath, 'utf8');
  const lines = logData.split('\n');
  
  const stats: Record<string, { alerts: number, resolutions: number }> = {};

  lines.forEach(line => {
    if (line.includes('FRICTION ALERT:')) {
      const itemName = line.split('FRICTION ALERT: ')[1].split(' at ')[0];
      if (!stats[itemName]) stats[itemName] = { alerts: 0, resolutions: 0 };
      stats[itemName].alerts++;
    }
    if (line.includes('RESOLVED:')) {
      const itemName = line.split('RESOLVED: ')[1].split(' at ')[0];
      if (!stats[itemName]) stats[itemName] = { alerts: 0, resolutions: 0 };
      stats[itemName].resolutions++;
    }
  });

  console.log("\n📊 --- AURA OS: WEEKLY FRICTION REPORT ---");
  console.table(Object.keys(stats).map(item => ({
    "Inventory Item": item,
    "Friction Events": stats[item].alerts,
    "Restocks Logged": stats[item].resolutions,
    "Status": stats[item].alerts > stats[item].resolutions ? "⚠️ Pending" : "✅ Clear"
  })));
}

generateReport();
