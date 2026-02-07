const API_URL = "https://volsim-pro.onrender.com";
let lastPrice = 0;

async function update() {
    const token = localStorage.getItem("volsim_token");
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/pulse`, { headers: { "Authorization": `Bearer ${token}` } });
        const data = await res.json();

        // Update Price with Color feedback
        const pDisp = document.getElementById('price-display');
        pDisp.innerText = `$${data.price.toLocaleString()}`;
        pDisp.className = data.price >= lastPrice ? 'price-up' : 'price-down';
        lastPrice = data.price;

        document.getElementById('balance').innerText = data.balance;
        document.getElementById('btc-holdings').innerText = data.btc;
        
        const balNum = parseFloat(data.balance.replace(/,/g, ''));
        const netWorth = balNum + (parseFloat(data.btc) * data.price);
        document.getElementById('net-worth').innerText = `$${netWorth.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        document.getElementById('status-bar').innerText = `LAST_SYNC: ${new Date().toLocaleTimeString()} | SYSTEM_STABLE`;
    } catch (e) { document.getElementById('status-bar').innerText = "CONNECTION_LOST"; }
}

async function trade(type) {
    const amount = document.getElementById('trade-amount').value;
    const token = localStorage.getItem("volsim_token");

    const res = await fetch(`${API_URL}/trade`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ type, amountBTC: amount })
    });

    if (res.ok) { update(); } 
    else { alert("Trade Rejected: Insufficient Funds/Holdings"); }
}

if (!localStorage.getItem("volsim_token")) {
    const u = prompt("User:"), p = prompt("Pass:");
    fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password: p })
    }).then(r => r.json()).then(d => {
        if(d.success) { localStorage.setItem("volsim_token", d.token); location.reload(); }
        else alert("Denied");
    });
} else {
    setInterval(update, 3000);
    update();
}
