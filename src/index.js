import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

// Pointing to the stable backend that is already providing $83,835+
const BACKEND_URL = "https://volsim-pro.onrender.com";

function App() {
  const [data, setData] = useState({ price: "83835.000", status: "SYNCING" });
  const [volatility, setVolatility] = useState(0);
  const [balance, setBalance] = useState(10000.00);
  const [autoTrade, setAutoTrade] = useState(false);
  const [logs, setLogs] = useState(["[SYS] LINKING TO STABLE_FEED..."]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const priceHistory = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/status`);
        const json = await res.json();
        const currentPrice = parseFloat(json.price);
        
        // Calculate Volatility locally
        priceHistory.current = [...priceHistory.current, currentPrice].slice(-20);
        if (priceHistory.current.length > 1) {
            const diffs = priceHistory.current.slice(1).map((p, i) => Math.abs(p - priceHistory.current[i]));
            const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
            setVolatility(Math.min(avg * 50, 100));
        }

        setData({ price: currentPrice.toFixed(3), status: "CONNECTED" });
      } catch (e) { 
        setData(prev => ({ ...prev, status: "RECONNECTING" }));
      }
    };
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTrade = () => {
    const change = (Math.random() * 80) * (Math.random() > 0.5 ? 1 : -1);
    setBalance(prev => prev + change);
    const time = new Date().toLocaleTimeString().split(' ')[0];
    setLogs(prev => [`[${time}] TRD: EXEC @ $${data.price}`, ...prev].slice(0, 4));
  };

  if (!isAuthorized) {
    return (
      <div style={{ backgroundColor: "#000", color: "#00ff88", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "monospace" }}>
          <button onClick={() => setIsAuthorized(true)} style={{ background: "none", border: "1px solid #00ff88", color: "#00ff88", padding: "15px 40px", cursor: "pointer", letterSpacing: "5px" }}>RE-ENTRY</button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#000", color: "#00ff88", fontFamily: "monospace", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ border: "1px solid #00ff88", padding: "30px", width: "400px", backgroundColor: "#050505", boxShadow: "0 0 20px rgba(0,255,136,0.1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", marginBottom: "20px", opacity: 0.6 }}>
          <span>LINK: {data.status}</span>
          <span>VOL_IDX: {volatility.toFixed(1)}%</span>
        </div>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "0.6rem", color: "#444" }}>MARKET_DATA_STREAM</div>
          <div style={{ fontSize: "3rem", fontWeight: "bold" }}>${data.price}</div>
        </div>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button onClick={() => setAutoTrade(!autoTrade)} style={{ flex: 1, background: autoTrade ? "#00ff88" : "#111", color: autoTrade ? "#000" : "#00ff88", border: "1px solid #00ff88", cursor: "pointer", padding: "10px" }}>ALGO: {autoTrade ? "ON" : "OFF"}</button>
          <button onClick={handleTrade} style={{ flex: 2, background: "#00ff88", color: "#000", border: "none", fontWeight: "bold", cursor: "pointer" }}>MANUAL_EXEC</button>
        </div>
        <div style={{ background: "#080808", padding: "10px", height: "80px", border: "1px solid #111" }}>
          {logs.map((log, i) => <div key={i} style={{ fontSize: "0.6rem", marginBottom: "3px" }}>{log}</div>)}
        </div>
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
          <span>BAL: ${balance.toFixed(2)}</span>
          <span style={{ color: balance >= 10000 ? "#00ff88" : "#ff4444" }}>{(((balance - 10000) / 100)).toFixed(2)}% P/L</span>
        </div>
      </div>
    </div>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);