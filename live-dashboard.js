const API_URL = "https://volsim-pro.onrender.com";

async function updateDashboard() {
    const token = localStorage.getItem("volsim_token");
    try {
        const res = await fetch(`${API_URL}/pulse`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("volsim_token");
            window.location.reload();
            return;
        }

        const data = await res.json();
        
        // Update DOM elements
        document.getElementById('backend-status').innerText = "SECURE_LINK";
        document.getElementById('balance').innerText = data.balance;
        document.getElementById('btc-holdings').innerText = data.btc;
        document.getElementById('btc-price').innerText = data.price.toLocaleString();
        
        // Proper Net Worth Calculation
        const balNum = parseFloat(data.balance.replace(/,/g, ''));
        const netWorth = balNum + (data.btc * data.price);
        document.getElementById('net-worth').innerText = netWorth.toLocaleString(undefined, {minimumFractionDigits: 2});
        
        document.getElementById('timestamp').innerText = new Date().toLocaleTimeString();
    } catch (err) {
        document.getElementById('backend-status').innerText = "OFFLINE";
    }
}

async function attemptLogin() {
    const user = prompt("Username:");
    const pass = prompt("Password:");

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: user, password: pass })
        });

        const data = await res.json();
        if (data.success) {
            localStorage.setItem("volsim_token", data.token);
            startApp();
        } else {
            alert("Unauthorized: " + (data.message || "Invalid Credentials"));
            window.location.reload();
        }
    } catch (e) {
        alert("Server Error. Please try again later.");
    }
}

function startApp() {
    setInterval(updateDashboard, 3000);
    updateDashboard();
}

// Logic: Check if token exists, if not, force login
if (!localStorage.getItem("volsim_token")) {
    attemptLogin();
} else {
    startApp();
}
