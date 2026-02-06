import React, { useState } from 'react';
import './App.css';

function App() {
  const [alias, setAlias] = useState('');
  const [securityKey, setSecurityKey] = useState('');
  const [status, setStatus] = useState('');
  const [wealth, setWealth] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000';

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus('ACCESSING_LEDGER...');

    try {
      const response = await fetch(\/api/login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          alias: alias, 
          security_key: securityKey 
        })
      });

      const data = await response.json();

      if (data.success) {
        setStatus('PROTOCOL_ACCEPTED');
        setWealth(data.wealth);
      } else {
        setStatus('ACCESS_DENIED: ' + (data.error || 'INVALID_CREDENTIALS'));
      }
    } catch (err) {
      console.error('CONNECTION_ERROR:', err);
      setStatus('OFFLINE_ERROR: CHECK_BACKEND_STATUS');
    }
  };

  return (
    <div className="app-container">
      <h1>VOLSIM PRO : LEDGER_ACCESS</h1>
      {!wealth ? (
        <form onSubmit={handleLogin}>
          <input 
            type="text" 
            placeholder="USER_ALIAS" 
            value={alias} 
            onChange={(e) => setAlias(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="SECURITY_KEY" 
            value={securityKey} 
            onChange={(e) => setSecurityKey(e.target.value)} 
          />
          <button type="submit">INITIALIZE_LOGIN</button>
          <p className="status">{status}</p>
        </form>
      ) : (
        <div className="dashboard">
          <h2>WELCOME, {alias}</h2>
          <div className="wealth-display">
            <label>MULTIVERSE_WEALTH:</label>
            <span>$ {wealth.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;