import React, { useState, useEffect } from 'react';

function App() {
  // --- CORE STATE ---
  const [v, setV] = useState({ mw: 1000000, pos: [] });
  const [marketPrice, setMarketPrice] = useState(60000);
  const [vaultBalance, setVaultBalance] = useState(0);
  const [user, setUser] = useState(null);

  // --- REAL-TIME MARKET FEED (COINBASE) ---
  useEffect(() => {
    const ws = new WebSocket("wss://ws-feed.exchange.coinbase.com");
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "subscribe", product_ids: ["BTC-USD"], channels: ["ticker"] }));
    };
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.price) setMarketPrice(parseFloat(data.price));
    };
    return () => ws.close();
  }, []);

  // --- AUTH LOGIC ---
  
  const syncToDatabase = async (newWealth, newVault) => {
    try {
      await fetch("https://volsim-pro.onrender.com/api/sync-vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          alias: user.alias, 
          newWealth: newWealth, 
          newVault: newVault 
        })
      });
      console.log("DATABASE_SYNC_COMPLETE");
    } catch (err) {
      console.error("SYNC_ERROR", err);
    }
  };

  const handleLogin = async (alias, password) => {
    try {
      
      console.log("ATTEMPTING_CONNECTION_TO: https://volsim-pro.onrender.com/api/login");
      
      console.log("ATTEMPTING_CONNECTION_TO: https://volsim-pro.onrender.com/api/login");
      const response = await fetch("https://volsim-pro.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alias, password })
      });
      const data = await response.json();
      if (data.token) {
        setUser(data.user);
        setV(prev => ({ ...prev, mw: parseFloat(data.user.wealth) }));
        setVaultBalance(parseFloat(data.user.vault));
      } else {
        alert("ACCESS_DENIED: INVALID_CREDENTIALS");
      }
    } catch (err) {
      alert("CONNECTION_ERROR: CHECK RENDER BACKEND");
    }
  };

  // --- LOGIN UI GATE ---
  if (!user) {
    return (
      <div style={{ backgroundColor: "#000", color: "#0f0", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: "monospace" }}>
        <div style={{ border: "1px solid #0f0", padding: "40px", textAlign: "center", boxShadow: "0 0 20px #0f03" }}>
          <h2 style={{ letterSpacing: "5px" }}>VOLSIM_PRO_V1_ACCESS</h2>
          <input id="alias" placeholder="ALIAS" style={{ display: "block", margin: "10px auto", background: "#000", border: "1px solid #0f0", color: "#0f0", padding: "10px", width: "200px" }} />
          <input id="pass" type="password" placeholder="SECURITY_KEY" style={{ display: "block", margin: "10px auto", background: "#000", border: "1px solid #0f0", color: "#0f0", padding: "10px", width: "200px" }} />
          <button onClick={() => handleLogin(document.getElementById("alias").value, document.getElementById("pass").value)}
            style={{ background: "#0f0", color: "#000", border: "none", padding: "10px 25px", cursor: "pointer", fontWeight: "bold", marginTop: "10px" }}>
            INITIALIZE_SESSION
          </button>
        </div>
      </div>
    );
  }

  // --- MAIN DASHBOARD ---
  return (
    <div style={{ backgroundColor: '#000', color: '#0f0', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>
      <header style={{ borderBottom: '1px solid #0f0', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1>VOLSIM_PRO // ARCHITECT: {user.alias}</h1>
        <p>ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬ÂÃƒâ€šÃ‚Â LIVE BTC/USD: ${marketPrice.toLocaleString()} | MULTIVERSE_WEALTH: ${v.mw.toLocaleString()}</p>
        <p>HEDGE_VAULT_BALANCE: ${vaultBalance.toLocaleString()}</p>
      </header>

      <section style={{ border: '1px solid #333', padding: '20px' }}>
        <h3>TRADING_TERMINAL</h3>
        <button onClick={() => {
            const size = 10000;
            if(v.mw >= size) {
                setV(prev => ({ ...prev, mw: prev.mw - size, pos: [...prev.pos, { id: Date.now(), entry: marketPrice, size }] }));
            }
        }} style={{ background: '#0f0', color: '#000', padding: '10px', border: 'none', cursor: 'pointer' }}>
          OPEN_BTC_POSITION ($10k)
        </button>

        <div style={{ marginTop: '20px' }}>
          <h4>LIVE_POSITIONS</h4>
          {v.pos.map(p => {
              const pnl = ((marketPrice - p.entry) / p.entry) * p.size;
              return (
                <div key={p.id} style={{ border: '1px solid #0f03', padding: '10px', margin: '5px 0' }}>
                  BTC | PNL: <span style={{ color: pnl >= 0 ? '#0f0' : '#f00' }}>${pnl.toFixed(2)}</span>
                  <button onClick={() => {
                      const sweep = pnl * 0.3;
                      setVaultBalance(prev => prev + sweep);
                      
                      const updatedWealth = v.mw + p.size + (pnl - sweep);
                      const updatedVault = vaultBalance + sweep;
                      setV(prev => ({ ...prev, mw: updatedWealth, pos: prev.pos.filter(x => x.id !== p.id) }));
                      setVaultBalance(updatedVault);
                      syncToDatabase(updatedWealth, updatedVault);
                  }} style={{ marginLeft: '10px', background: '#333', color: '#0f0', border: '1px solid #0f0', cursor: 'pointer' }}>CLOSE & SWEEP 30%</button>
                </div>
              );
          })}
        </div>
      </section>
    </div>
  );
}

export default App;