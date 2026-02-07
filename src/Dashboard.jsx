import React, { useEffect, useState } from 'react';

const API = 'https://volsim-pro.onrender.com';

export default function Dashboard() {
    const [data, setData] = useState({ balance: '1,240,270.80', btc: 0, price: 98000, history: [98000, 98000], botActive: false });
    const [status, setStatus] = useState('CONNECTING...');

    const pulse = async () => {
        try {
            const res = await fetch(`${API}/pulse`);
            if (!res.ok) throw new Error();
            const json = await res.json();
            setData(json);
            setStatus('LIVE_CORE');
        } catch (err) {
            setStatus('OFFLINE');
        }
    };

    useEffect(() => {
        pulse();
        const interval = setInterval(pulse, 3000);
        return () => clearInterval(interval);
    }, []);

    const exec = async (e) => {
        e.preventDefault();
        const cmd = e.target.cmd.value;
        try {
            await fetch(`${API}/command`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cmd })
            });
            pulse();
        } catch (e) {}
        e.target.cmd.value = '';
    };

    const min = Math.min(...data.history);
    const max = Math.max(...data.history);
    const range = (max - min) || 1;
    const points = data.history.map((p, i) => `${(i / (data.history.length - 1)) * 100},${100 - ((p - min) / range) * 100}`).join(' ');

    return (
        <div style={{background:'#000', color:'#0f0', height:'100vh', padding:'25px', fontFamily:'monospace', display:'flex', flexDirection:'column', boxSizing:'border-box'}}>
            <div style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid #111', paddingBottom:'10px'}}>
                <div>
                    <div style={{fontSize:'32px', fontWeight:'bold', letterSpacing:'-1px'}}>${data.balance}</div>
                    <div style={{fontSize:'12px', color: '#555'}}>BTC_HOLDINGS: {data.btc}</div>
                </div>
                <div style={{textAlign:'right'}}>
                    <div style={{color: status === 'LIVE_CORE' ? '#0f0' : '#f00', textShadow: status === 'LIVE_CORE' ? '0 0 5px #0f0' : 'none'}}>? {status}</div>
                    <div style={{fontSize:'20px', marginTop:'5px'}}>${data.price.toFixed(2)}</div>
                </div>
            </div>

            <div style={{flex: 1, margin:'30px 0', position:'relative', borderLeft:'1px solid #111', borderBottom:'1px solid #111'}}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{width:'100%', height:'100%'}}>
                    <polyline fill="none" stroke="#0f0" strokeWidth="1" points={points} />
                </svg>
            </div>

            <form onSubmit={exec}>
                <input name="cmd" autoFocus autoComplete="off" style={{width:'100%', background:'#111', color:'#0f0', border:'none', padding:'15px', outline:'none', borderLeft:'3px solid #0f0'}} placeholder="SYSTEM_COMMAND_ENTRY..." />
            </form>
        </div>
    );
}
