import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState({ btc_price: 0, gold_price: 0, ratio: 0 });
  const [history, setHistory] = useState([]);
  const [chart, setChart] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      fetch('https://volsim-pro.onrender.com/status')
        .then(res => res.json())
        .then(json => {
          setData(json);
          setChart(prev => [...prev.slice(-15), json.btc_price]); // Keep last 15 points
        });
      fetch('https://volsim-pro.onrender.com/history')
        .then(res => res.json())
        .then(setHistory);
    };
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSniper = () => {
    fetch('https://volsim-pro.onrender.com/sniper')
      .then(() => window.navigator.vibrate && window.navigator.vibrate(100));
  };

  return (
    <div className="terminal">
      <div className="header">VOLSIM_PRO_v2.0 // RATIO: {data.ratio} XAU/BTC</div>
      
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
          <div key={t.id} className="log-entry">>> EXEC @ {t.price} [{t.time}]</div>
        ))}
      </div>

      <button className="sniper-btn" onClick={handleSniper}>ENGAGE SNIPER</button>
    </div>
  );
}
export default App;
