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
        
        // Fix for Last Update
        document.getElementById('timestamp').innerText = new Date().toLocaleTimeString();
    } catch (err) {
        document.getElementById('backend-status').innerText = "OFFLINE";
    }
}

// Secure Login Prompt
if (!sessionStorage.getItem('volsim_auth')) {
    const accessKey = prompt("Volsim Pro Secure Access\nEnter Key:");
    if (accessKey === "admin") { // You can change 'admin' to your preferred password
        sessionStorage.setItem('volsim_auth', 'true');
        startApp();
    } else {
        alert("Access Denied");
        window.location.reload();
    }
} else {
    startApp();
}

function startApp() {
    setInterval(updateDashboard, 3000);
    updateDashboard();
}
