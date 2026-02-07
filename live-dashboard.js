const API_URL = "https://volsim-pro.onrender.com";
let lastPrices = {};

async function update() {
    const token = localStorage.getItem("volsim_token");
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/pulse`, { headers: { "Authorization": `Bearer ${token}` } });
        const data = await res.json();

        // Rounding Cash
        const rawCash = parseFloat(data.rawBalance);
        document.getElementById('balance').innerText = rawCash.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        
        // Update Market Table
        let tableHtml = "<tr><th>ASSET</th><th>PRICE</th><th>OWNED</th></tr>";
        let totalValue = rawCash;
        
        for (const [asset, price] of Object.entries(data.prices)) {
            const owned = data.portfolio[asset] || 0;
            totalValue += owned * price;
            const colorClass = price >= (lastPrices[asset] || 0) ? "price-up" : "price-down";
            
            // Format price: JPY gets more decimals, others get 2
            const formattedPrice = asset === "JPY" ? price.toFixed(4) : price.toLocaleString(undefined, {minimumFractionDigits: 2});
            
            tableHtml += `<tr><td>${asset}</td><td class="${colorClass}">$${formattedPrice}</td><td>${owned.toFixed(4)}</td></tr>`;
            lastPrices[asset] = price;
        }
        
        document.getElementById('market-table').innerHTML = tableHtml;
        document.getElementById('net-worth').innerText = `$${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

        // Update History
        let histHtml = "<tr><th>TIME</th><th>ACTION</th><th>ASSET</th><th>QTY</th><th>PRICE</th></tr>";
        data.history.forEach(h => {
            histHtml += `<tr><td>${h.time}</td><td>${h.type}</td><td>${h.asset}</td><td>${h.amount}</td><td>$${h.price.toLocaleString()}</td></tr>`;
        });
        document.getElementById('history-table').innerHTML = histHtml;
    } catch (e) { console.log("Sync Error"); }
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
    if (res.ok) update(); else const err = await res.json(); alert(`TRADE_REJECTED: ${err.message || "UNKNOWN_ERROR"}`);
}

if (!localStorage.getItem("volsim_token")) {
    // Basic auth logic remains same
} else {
    setInterval(update, 3000);
    update();
}
