import React, { useState, useEffect } from "react";
export default function App() {
  const [data, setData] = useState({ btc_price: "Loading...", status: "connecting" });
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("https://volsim-pro.onrender.com/status");
        const json = await res.json();
        setData(json);
      } catch (err) { setData({ btc_price: "Error", status: "offline" }); }
    };
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div style={{ backgroundColor: "#000", color: "#0f0", height: "100vh", padding: "20px", fontFamily: "monospace" }}>
      <h1>VOLSIM PRO DASHBOARD</h1>
      <hr />
      <p>ENGINE STATUS: {data.status}</p>
      <h2 style={{ fontSize: "3rem" }}>BTC: ${data.btc_price}</h2>
    </div>
  );
}
// Final Build Trigger: 02/01/2026 19:13:54
