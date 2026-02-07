import React, { useState } from 'react';
import Dashboard from './Dashboard';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    // Simplified logic: If code is 1337, let them in. 
    // You can also point this to your Render backend if you have a /login route.
    if (code === '1337') {
      setIsLoggedIn(true);
    } else {
      setError('INVALID_ACCESS_CODE');
    }
  };

  if (isLoggedIn) return <Dashboard />;

  return (
    <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>
      <form onSubmit={handleLogin} style={{border:'1px solid #111', padding:'40px', textAlign:'center'}}>
        <h1 style={{fontSize:'18px', marginBottom:'20px'}}>SYSTEM_ACCESS_REQUIRED</h1>
        <input 
          type="password" 
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="ENTER_PASSCODE" 
          style={{background:'#111', border:'1px solid #0f0', color:'#0f0', padding:'10px', outline:'none', textAlign:'center'}}
        />
        {error && <div style={{color:'#f00', marginTop:'10px', fontSize:'12px'}}>{error}</div>}
        <button type="submit" style={{display:'none'}}>SUBMIT</button>
      </form>
    </div>
  );
}
