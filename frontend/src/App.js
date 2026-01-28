import { hudStyles as s } from './hudStyles';

function App() {
  return (
    <div style={s.hudBody}>
      <header style={s.sectionTitle}>AURA-OS // CORE HUD</header>
      
      <main style={s.mainScroll}>
        <div style={s.grid3Col}>
          <div style={s.tableCard}>INVENTORY</div>
          <div style={s.tableCard}>LOGISTICS</div>
          <div style={s.tableCard}>FRICTION</div>
        </div>
        
        <div style={s.logBox}>
          <div style={s.logEntry}>[SYSTEM] Initialization complete...</div>
        </div>
      </main>

      <footer style={s.footerNav}>
        <button style={s.footTab}>DASHBOARD</button>
        <button style={s.footTab}>SETTINGS</button>
      </footer>
    </div>
  );
}
