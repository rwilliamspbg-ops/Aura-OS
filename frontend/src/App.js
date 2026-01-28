import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://10.0.0.5:3001');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

export default function App() {
  const [status, setStatus] = useState('OFFLINE');
  const [role, setRole] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [lexiconOpen, setLexiconOpen] = useState(false);
  const targetRef = useRef('All');

  useEffect(() => {
    socket.on('connect', () => setStatus('ONLINE'));
    socket.on('history_load', (history) => setOrders(history));
    socket.on('order_update', (newOrder) => {
      setOrders(prev => [newOrder, ...prev]);
      if (role === newOrder.target || newOrder.target === 'All') {
        const utterance = new SpeechSynthesisUtterance(newOrder.type);
        window.speechSynthesis.speak(utterance);
      }
    });

    if (recognition) {
      recognition.continuous = true;
      recognition.onresult = (e) => {
        const text = e.results[e.results.length - 1][0].transcript;
        fireOrder(`VOICE: ${text}`, targetRef.current);
      };
    }
    return () => socket.off();
  }, [role]);

  const handleHoldStart = (targetStation) => {
    if (!recognition) return;
    targetRef.current = targetStation;
    setIsListening(true);
    recognition.start();
  };

  const handleHoldEnd = () => {
    if (!recognition) return;
    setIsListening(false);
    recognition.stop();
  };

  const fireOrder = (type, target = 'All') => {
    socket.emit('new_order', {
      id: Math.random().toString(36).substr(2, 5),
      role,
      target,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  if (!role) return (
    <div style={styles.selectorBg}>
      <h1 style={styles.neonText}>AURA OS v26.2</h1>
      <div style={styles.roleGrid}>
        {['Waitress', 'Kitchen', 'Hostess', 'Manager'].map(r => (
          <button key={r} onClick={() => setRole(r)} style={styles.roleCard}>{r}</button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={styles.appContainer}>
      <nav style={styles.topNav}>
        <div style={styles.brand} onClick={() => setLexiconOpen(true)}>📖 LEXICON</div>
        <div style={{fontWeight: 'bold', color: '#0F0'}}>AURA // {role.toUpperCase()}</div>
        <div style={{fontSize: '10px', color: status === 'ONLINE' ? '#0F0' : '#F00'}}>● {status}</div>
      </nav>

      <div style={styles.hudBody}>
        {isListening && <VisualWaveform />}

        <div style={styles.mainScroll}>
          {role === 'Waitress' && <WaitressHUD fireOrder={fireOrder} />}
          {role === 'Kitchen' && <KitchenHUD orders={orders.filter(o => o.target === 'Kitchen' || o.target === 'All')} />}
          {role === 'Manager' && <ManagerHUD orders={orders} />}
          {role === 'Hostess' && <HostessHUD fireOrder={fireOrder} />}
        </div>

        {(role === 'Waitress' || role === 'Hostess') && (
          <div style={styles.pttDock}>
             <button 
              onMouseDown={() => handleHoldStart('Kitchen')} 
              onMouseUp={handleHoldEnd}
              onTouchStart={() => handleHoldStart('Kitchen')}
              onTouchEnd={handleHoldEnd}
              style={{...styles.pttBtn, borderColor: '#0F0'}}
            >
              🎤 KITCHEN
            </button>
            <button 
              onMouseDown={() => handleHoldStart('Manager')} 
              onMouseUp={handleHoldEnd}
              onTouchStart={() => handleHoldStart('Manager')}
              onTouchEnd={handleHoldEnd}
              style={{...styles.pttBtn, borderColor: '#0CF'}}
            >
              📊 METRICS
            </button>
          </div>
        )}
      </div>

      <footer style={styles.footerNav}>
        <button style={styles.footTab} onClick={() => setCartOpen(true)}>🛒 CART</button>
        <button style={styles.footTab} onClick={() => setRole(null)}>LOGOUT</button>
      </footer>

      <CartSheet isOpen={isCartOpen} close={() => setCartOpen(false)} />
      <LexiconDrawer isOpen={lexiconOpen} close={() => setLexiconOpen(false)} />
    </div>
  );
}

// --- SUB-COMPONENTS ---
const WaitressHUD = ({ fireOrder }) => (
  <div style={styles.grid3Col}>
    {Array(12).fill(0).map((_, i) => (
      <div key={i} style={styles.tableCard} onClick={() => fireOrder(`T-${i+1} Metric Query`, 'Manager')}>
        <div style={{fontSize: '1.2rem', color: '#0F0'}}>T-{i+1}</div>
        <div style={{fontSize: '0.6rem', color: '#555'}}>ACTIVE</div>
      </div>
    ))}
  </div>
);

const KitchenHUD = ({ orders }) => (
  <div style={styles.flexCol}>
    <h3 style={styles.sectionTitle}>ACTIVE TICKETS</h3>
    {orders.map(o => (
      <div key={o.id} style={styles.kitchenTicket}>
        <strong>{o.time}</strong> | {o.type}
      </div>
    ))}
  </div>
);

const ManagerHUD = ({ orders }) => (
  <div style={styles.logBox}>
    <h3 style={styles.sectionTitle}>REAL-TIME REVENUE & AUDIT</h3>
    {orders.map(o => <div key={o.id} style={styles.logEntry}>[{o.time}] {o.role}: {o.type}</div>)}
  </div>
);

const HostessHUD = ({ fireOrder }) => (
  <div style={styles.flexCol}>
    <h3 style={styles.sectionTitle}>FLOOR SEATING</h3>
    <button onClick={() => fireOrder('Hostess: Table 4 Cleared', 'Waitress')} style={styles.actionLarge}>T-4 READY</button>
  </div>
);

const VisualWaveform = () => (
  <div style={styles.waveOverlay}>
    {[1, 2, 3, 4, 5].map(b => <div key={b} style={{...styles.waveBar, animationDelay: `${b*0.1}s`}} />)}
  </div>
);

const CartSheet = ({ isOpen, close }) => (
  <div style={{...styles.bottomSheet, transform: isOpen ? 'translateY(0)' : 'translateY(100%)'}}>
    <div style={styles.sheetHandle} onClick={close} />
    <div style={styles.categoryRow}>
      {['MAINS', 'DRINKS', 'SIDES', 'APPZ'].map(c => <button key={c} style={styles.catBtn}>{c}</button>)}
    </div>
    <div style={{padding: '40px', textAlign: 'center', opacity: 0.4}}>Select items for lightning-fast sync...</div>
  </div>
);

const LexiconDrawer = ({ isOpen, close }) => (
  <div style={{...styles.sideDrawer, left: isOpen ? 0 : '-100%'}}>
    <h3 style={{color: '#0F0'}}>VOCAL COMMANDS</h3>
    <div style={styles.logEntry}>"Fire [Item]" - Send to Kitchen</div>
    <div style={styles.logEntry}>"Status Table [X]" - Revenue Check</div>
    <div style={styles.logEntry}>"Occupancy" - Current Load</div>
    <div style={styles.logEntry}>"Stock [Item]" - Friction Check</div>
    <button onClick={close} style={styles.actionLarge}>CLOSE</button>
  </div>
);

// --- CONSOLIDATED STYLES ---
const styles = {
  appContainer: { background: '#000', height: '100vh', display: 'flex', flexDirection: 'column', userSelect: 'none' },
  topNav: { display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #222', background: '#080808', alignItems: 'center' },
  brand: { fontSize: '0.8rem', color: '#0F0', fontWeight: 'bold' },
  hudBody: { flex: 1, display: 'flex', flexDirection: 'column', padding: '10px', position: 'relative' },
  mainScroll: { flex: 1, overflowY: 'auto' },
  grid3Col: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' },
  tableCard: { background: '#0a0a0a', border: '1px solid #222', padding: '15px 5px', textAlign: 'center', borderRadius: '8px' },
  pttDock: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '10px 0' },
  pttBtn: { padding: '20px', background: '#000', color: '#fff', border: '2px solid', borderRadius: '12px', fontWeight: 'bold', touchAction: 'none' },
  footerNav: { height: '60px', background: '#080808', display: 'flex', borderTop: '1px solid #222' },
  footTab: { flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: '0.7rem' },
  bottomSheet: { position: 'fixed', bottom: 0, left: 0, right: 0, height: '70vh', background: '#0a0a0a', borderTop: '2px solid #0F0', transition: '0.3s ease', zIndex: 1000 },
  sideDrawer: { position: 'fixed', top: 0, bottom: 0, width: '80%', background: '#000', zIndex: 2000, padding: '20px', borderRight: '1px solid #0F0', transition: '0.3s ease' },
  sheetHandle: { width: '40px', height: '5px', background: '#333', margin: '15px auto', borderRadius: '10px' },
  categoryRow: { display: 'flex', gap: '10px', padding: '0 20px', overflowX: 'auto' },
  catBtn: { padding: '8px 15px', background: '#111', border: '1px solid #333', color: '#0F0', borderRadius: '20px', fontSize: '0.6rem' },
  kitchenTicket: { background: '#fff', color: '#000', padding: '10px', marginBottom: '8px', borderLeft: '8px solid #0F0' },
  logBox: { background: '#050505', padding: '10px', flex: 1 },
  logEntry: { fontSize: '0.7rem', borderBottom: '1px solid #111', padding: '8px 0', color: '#ccc' },
  waveOverlay: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', height: '50px' },
  waveBar: { width: '6px', height: '20px', background: '#0F0', borderRadius: '3px', animation: 'wave 0.6s ease-in-out infinite alternate' },
  selectorBg: { background: '#000', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  neonText: { color: '#0F0', textShadow: '0 0 10px #0F0', marginBottom: '30px' },
  roleGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  roleCard: { padding: '40px', background: 'transparent', border: '1px solid #0F0', color: '#0F0', fontSize: '1rem', borderRadius: '8px' },
  actionLarge: { width: '100%', padding: '20px', background: '#111', color: '#0F0', border: '1px solid #0F0', marginTop: '20px' },
  sectionTitle: { fontSize: '0.7rem', color: '#0F0', marginBottom: '10px', borderBottom: '1px solid #111' }
};
