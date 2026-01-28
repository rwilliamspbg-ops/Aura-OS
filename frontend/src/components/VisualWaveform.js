import React from 'react';

const VisualWaveform = ({ isListening }) => {
  const bars = [1, 2, 3, 4, 5];
  return (
    <div style={styles.container}>
      {bars.map((_, i) => (
        <div
          key={i}
          style={{
            ...styles.bar,
            animation: isListening ? `wave 0.6s ease-in-out ${i * 0.1}s infinite` : 'none',
            height: isListening ? '25px' : '8px',
            opacity: isListening ? 1 : 0.4
          }}
        />
      ))}
      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(2.5); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: { display: 'flex', alignItems: 'center', gap: '4px', height: '40px', justifyContent: 'center' },
  bar: { width: '4px', background: '#0F0', borderRadius: '2px', transition: 'all 0.3s ease' }
};

export default VisualWaveform;
