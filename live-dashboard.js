const API = "https://volsim-pro.onrender.com/pulse";

async function updateDashboard() {
    try {
        const res = await fetch(API);
        const data = await res.json();
        
        console.log("Data Received:", data); // This helps us debug in F12

        document.getElementById('backend-status').innerText = "ONLINE";
        document.getElementById('backend-status').style.color = "#0f0";
        
        // Match the keys exactly as they come from server.js
        document.getElementById('balance').innerText = data.balance || "0.00";
        document.getElementById('btc-holdings').innerText = data.btc || "0";
        document.getElementById('btc-price').innerText = data.price ? data.price.toFixed(2) : "N/A";
        
        // Calculate Net Worth (Balance is a string, so we clean it)
        const numericBalance = parseFloat(data.balance.replace(/,/g, '')) || 0;
        const netWorth = numericBalance + (data.btc * data.price || 0);
        document.getElementById('net-worth').innerText = netWorth.toLocaleString(undefined, {minimumFractionDigits: 2});
        
        document.getElementById('timestamp').innerText = new Date().toLocaleString();
    } catch (err) {
        document.getElementById('backend-status').innerText = "OFFLINE";
        document.getElementById('backend-status').style.color = "#f00";
    }
}

setInterval(updateDashboard, 3000);
updateDashboard();
