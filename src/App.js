import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState({ btc_price: 0, gold_price: 0, ratio: 0 });
  const [history, setHistory] = useState([]);
  const [chart, setChart] = useState([]);

    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://volsim-pro.onrender.com/status');
        const data = await response.json();
        
        // Safety Guard: Map btc_price to price and prevent NaN
        if (data.btc_price) {
          setPrice(Number(data.btc_price));
          setRatio(Number(data.ratio));
        } else if (data.price) {
          setPrice(Number(data.price));
        }
      } catch (err) {
        console.error("Data Stream Error:", err);
      }
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

