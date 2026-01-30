import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState({ price: 0, status: "CONNECTING" });
  const [alertPrice, setAlertPrice] = useState(84000);

  useEffect(() => {
    const fetchData = () => {
      fetch('https://volsim-pro.onrender.com/status')
        .then(res => res.json())
        .then(json => {
          setData(json);
          if (json.price >= alertPrice && window.navigator.vibrate) {
            window.navigator.vibrate([200, 100, 200]);
          }
        })
        .catch(err => console.log("Backend offline"));
    };
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [alertPrice]);

  return (
    <div className="terminal">
      <header className="header"><span className="blink">●</span> VOLSIM_PRO_LIVE</header>
      <div className="price-display">
        <label>BTC/USD_ORACLE</label>
        <h1 className={data.price >= alertPrice ? "price-alert" : "price-normal"}>
          ${data.price.toLocaleString()}
        </h1>
      </div>
      <div className="controls">
        <div className="alert-input">
          <label>SET_TARGET</label>
          <input type="number" value={alertPrice} onChange={(e) => setAlertPrice(e.target.value)} />
        </div>
        <button className="sniper-btn" onClick={() => alert('SNIPER_ENGAGED')}>ENGAGE SNIPER</button>
      </div>
    </div>
  );
}
export default App;