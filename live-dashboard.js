const API = "https://volsim-pro.onrender.com/pulse";

async function updateDashboard() {
    try {
        const res = await fetch(API);
        if (!res.ok) throw new Error("Backend unreachable");
        const data = await res.json();
        
        // Update UI Elements
        document.getElementById('backend-status').innerText = "ONLINE";
        document.getElementById('backend-status').style.color = "#00ff00";
        document.getElementById('balance').innerText = data.balance;
        document.getElementById('btc-holdings').innerText = data.btc;
        
        // Calculate Net Worth
        const balNum = parseFloat(data.balance.replace(/,/g, ''));
        const netWorth = balNum + (data.btc * data.price);
        document.getElementById('net-worth').innerText = netWorth.toLocaleString(undefined, {minimumFractionDigits: 2});
        
        document.getElementById('btc-price').innerText = data.price.toLocaleString();
        document.getElementById('timestamp').innerText = new Date().toLocaleString();
        
        // Update Persona/Market placeholders
        document.getElementById('market-prediction').innerText = data.price > 98000 ? "BULLISH" : "STABLE";
        document.getElementById('persona-state').innerText = "ACTIVE";

    } catch (err) {
        console.error("Fetch error:", err);
        document.getElementById('backend-status').innerText = "OFFLINE";
        document.getElementById('backend-status').style.color = "#ff0000";
    }
}

// Initial login prompt simulation
if (!sessionStorage.getItem('volsim_auth')) {
    const pass = prompt("Enter Access Key:");
    if (pass === "admin") { // You can change this key
        sessionStorage.setItem('volsim_auth', 'true');
        setInterval(updateDashboard, 3000);
        updateDashboard();
    } else {
        alert("Access Denied");
        window.location.reload();
    }
} else {
    setInterval(updateDashboard, 3000);
    updateDashboard();
}
