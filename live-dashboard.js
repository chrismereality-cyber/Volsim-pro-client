const API = "https://volsim-pro.onrender.com/pulse";

async function updateDashboard() {
    try {
        const res = await fetch(API);
        const data = await res.json();
        
        document.getElementById('backend-status').innerText = "ONLINE";
        document.getElementById('backend-status').style.color = "#00ff00";
        document.getElementById('balance').innerText = data.balance;
        document.getElementById('btc-holdings').innerText = data.btc;
        document.getElementById('btc-price').innerText = data.price.toLocaleString();
        
        const balNum = parseFloat(data.balance.replace(/,/g, ''));
        const netWorth = balNum + (data.btc * data.price);
        document.getElementById('net-worth').innerText = netWorth.toLocaleString(undefined, {minimumFractionDigits: 2});
        
        document.getElementById('timestamp').innerText = new Date().toLocaleTimeString();
    } catch (err) {
        console.error("Dashboard Error:", err);
        document.getElementById('backend-status').innerText = "OFFLINE";
        document.getElementById('backend-status').style.color = "#ff0000";
    }
}

setInterval(updateDashboard, 3000);
updateDashboard();
