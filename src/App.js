import React, { useState, useEffect } from 'react';

function App() {
  const [price, setPrice] = useState(0);
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    const syncEngine = async () => {
      try {
        const res = await fetch('https://volsim-pro.onrender.com/status');
        const data = await res.json();
        
        const freshPrice = Number(data.btc_price || data.price || 0);
        const freshRatio = Number(data.ratio || 0);

        if (!isNaN(freshPrice) && freshPrice !== 0) {
          setPrice(freshPrice);
          setRatio(freshRatio);
        }
      } catch (e) {
        console.warn("Ghost detected...");
      }
    };

    const heartBeat = setInterval(syncEngine, 2000);
    syncEngine(); // Run immediately on load
    return () => clearInterval(heartBeat);
  }, []);

  return (
    <div style={{background: '#000', color: '#0f0', padding: '30px', fontFamily: 'monospace', minHeight: '100vh'}}>
      <div style={{border: '1px solid #0f0', padding: '20px'}}>
        <h2 style={{textShadow: '0 0 10px #0f0'}}>LINK: CONNECTED</h2>
        <div style={{opacity: 0.7}}>MARKET_DATA_STREAM_V3</div>
        <h1 style={{fontSize: '3.5rem', margin: '20px 0'}}>${price.toLocaleString(undefined, {minimumFractionDigits: 2})}</h1>
        <div style={{fontSize: '1.2rem'}}>XAU/BTC_RATIO: {ratio.toFixed(4)}</div>
        <div style={{marginTop: '40px', color: '#555', fontSize: '0.8rem'}}>NO_GHOST_PROTOCOL_ACTIVE</div>
      </div>
    </div>
  );
}

export default App;