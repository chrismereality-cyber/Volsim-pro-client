import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState(0);
  const [history, setHistory] = useState(0);
  const [chart, setChart] = useState(0);

      useEffect(() => {
    const update = () => {
      fetch("https://volsim-pro.onrender.com/status")
        .then(res => res.json())
        .then(data => {
          const val = data.btc_price || data.price || 0;
          setPrice(Number(val));
        })
        .catch(e => console.log("Waiting for stream..."));
    };
    const timer = setInterval(update, 2000);
    update();
    return () => clearInterval(timer);
  }, []);

  const handleSniper = () => {
    fetch('https://volsim-pro.onrender.com/sniper')
      .then(() => window.navigator.vibrate && window.navigator.vibrate(100));
  };

  return (
    <div className="terminal">
      <div className="header">VOLSIM_PRO_v2.0 // RATIO: {Number(data.ratio)} XAU/BTC</div>
      
      <div className="chart-area">
        {chart.map((p, i) => (
          <div key={i} className="bar" style={{height: `${(p/90000)*100}%`}}></div>
        ))}
      </div>

      <div className="price-display">
        <h1>${data.btc_price.toLocaleString(undefined, {minimumFractionDigits: 2})}</h1>
      </div>

      <div className="trade-log">
        {history.map(t => (
          <div key={t.id} className="log-entry">>> EXEC @ {t.btc_price} [{t.time}]</div>
        ))}
      </div>

      <button className="sniper-btn" onClick={handleSniper}>ENGAGE SNIPER</button>
    </div>
  );
}
export default App;


