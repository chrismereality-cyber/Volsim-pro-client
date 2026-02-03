import React, { useState, useEffect } from "react";

export default function App() {
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState("SYNCING...");
  const [error, setError] = useState(null);

  // Your verified Render URL
  const API_URL = "https://volsim-pro.onrender.com"; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/data`);
        if (!response.ok) throw new Error(`HTTP_${response.status}`);
        const data = await response.json();
        setPrice(data.price || 0);
        setStatus("STABLE");
        setError(null);
      } catch (err) {
        setStatus("OFFLINE");
        setError(err.message);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{background: '#000', color: '#0f0', padding: '30px', fontFamily: 'monospace', minHeight: '100vh'}}>
      <div style={{border: '1px solid #0f0', padding: '20px', boxShadow: '0 0 15px rgba(0,255,0,0.2)'}}>
        <h2 style={{textShadow: '0 0 10px #0f0'}}>VOLSIM_ENGINE_V2_{status}</h2>
        <div style={{opacity: 0.6, fontSize: '0.8rem'}}>LINK: {API_URL}</div>
        <h1 style={{fontSize: '4rem', margin: '20px 0', letterSpacing: '-2px'}}>
          ${price.toLocaleString(undefined, {minimumFractionDigits: 2})}
        </h1>
        {error && <div style={{color: '#ff0055', marginBottom: '10px'}}>ERR_SIG: {error}</div>}
        <div style={{color: '#000', background: '#0f0', display: 'inline-block', padding: '5px 15px', fontWeight: 'bold'}}>
          LIVE_DATA_FEED
        </div>
      </div>
    </div>
  );
}
