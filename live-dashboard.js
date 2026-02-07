const API_URL = "https://volsim-pro.onrender.com";

async function updateDashboard() {
    const token = localStorage.getItem("volsim_token");
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/pulse`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (res.status === 401) {
            localStorage.removeItem("volsim_token");
            location.reload();
            return;
        }

        const data = await res.json();
        document.getElementById('backend-status').innerText = "V12_SECURE_LINK";
        document.getElementById('balance').innerText = data.balance;
        document.getElementById('btc-holdings').innerText = data.btc;
        document.getElementById('btc-price').innerText = data.price.toLocaleString();
        
        const balNum = parseFloat(data.balance.replace(/,/g, ''));
        const netWorth = balNum + (parseFloat(data.btc) * data.price);
        document.getElementById('net-worth').innerText = netWorth.toLocaleString(undefined, {minimumFractionDigits: 2});
        document.getElementById('timestamp').innerText = new Date().toLocaleTimeString();
    } catch (err) {
        document.getElementById('backend-status').innerText = "OFFLINE";
    }
}

async function executeTrade() {
    const amount = document.getElementById('trade-amount').value;
    const token = localStorage.getItem("volsim_token");

    const res = await fetch(`${API_URL}/trade`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ amountBTC: amount })
    });

    const result = await res.json();
    if (result.success) {
        alert("TRADE SUCCESSFUL");
        updateDashboard();
    } else {
        alert("TRADE FAILED: " + result.message);
    }
}

async function login() {
    const user = prompt("User:");
    const pass = prompt("Pass:");
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass })
    });
    if (res.ok) {
        const data = await res.json();
        localStorage.setItem("volsim_token", data.token);
        location.reload();
    } else {
        alert("Login Failed");
    }
}

if (!localStorage.getItem("volsim_token")) {
    login();
} else {
    setInterval(updateDashboard, 3000);
    updateDashboard();
}
