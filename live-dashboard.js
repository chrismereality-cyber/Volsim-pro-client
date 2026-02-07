const API_URL = "https://volsim-pro.onrender.com";
let lastPrices = {};

async function update() {
    const token = localStorage.getItem("volsim_token");
    if (!token) return;
    const res = await fetch(`${API_URL}/pulse`, { headers: { "Authorization": `Bearer ${token}` } });
    const data = await res.json();

    document.getElementById('balance').innerText = data.balance;
    
    // Update Market Table
    let tableHtml = "<tr><th>Asset</th><th>Price</th><th>Owned</th></tr>";
    let totalValue = data.rawBalance;
    
    for (const [asset, price] of Object.entries(data.prices)) {
        const owned = data.portfolio[asset] || 0;
        totalValue += owned * price;
        const colorClass = price >= (lastPrices[asset] || 0) ? "price-up" : "price-down";
        tableHtml += `<tr><td>${asset}</td><td class="${colorClass}">$${price.toLocaleString()}</td><td>${owned.toFixed(4)}</td></tr>`;
        lastPrices[asset] = price;
    }
    document.getElementById('market-table').innerHTML = tableHtml;
    document.getElementById('net-worth').innerText = `$${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}`;

    // Update History
    let histHtml = "<tr><th>Time</th><th>Action</th><th>Asset</th><th>Amount</th><th>Price</th></tr>";
    data.history.forEach(h => {
        histHtml += `<tr><td>${h.time}</td><td>${h.type}</td><td>${h.asset}</td><td>${h.amount}</td><td>$${h.price.toLocaleString()}</td></tr>`;
    });
    document.getElementById('history-table').innerHTML = histHtml;
}

async function trade(type) {
    const asset = document.getElementById('asset-select').value;
    const amount = document.getElementById('trade-amount').value;
    const token = localStorage.getItem("volsim_token");

    const res = await fetch(`${API_URL}/trade`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ type, asset, amount })
    });
    if (res.ok) update(); else alert("Trade Failed");
}

if (!localStorage.getItem("volsim_token")) {
    const u = prompt("User:"), p = prompt("Pass:");
    fetch(`${API_URL}/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: u, password: p }) })
    .then(r => r.json()).then(d => { if(d.success) { localStorage.setItem("volsim_token", d.token); location.reload(); }});
} else { setInterval(update, 3000); update(); }
// V14.1 Sync Cache Buster
