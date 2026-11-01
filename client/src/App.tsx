import React from 'react';

export function App(): React.JSX.Element {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <header>
        <h1 style={{ color: '#be123c', marginBottom: '0.5rem' }}>PopQueue</h1>
        <p style={{ color: '#475569', fontSize: '1.1rem' }}>
          Art Toy Live Unboxing Queue Management System
        </p>
      </header>
      <main style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <h2>Welcome to PopQueue</h2>
        <p>The queue service is currently initializing. Please sign in to join a waiting line or manage a counter.</p>
        <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '4px', fontSize: '0.9rem' }}>
          Status: <strong>System Operational</strong>
        </div>
      </main>
    </div>
  );
}

export default App;
