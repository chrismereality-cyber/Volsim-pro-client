const API_URL = "https://volsim-pro.onrender.com";

async function attemptLogin() {
    const user = prompt("Username:");
    const pass = prompt("Password:");

    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass })
    });

    const data = await res.json();
    if (data.success) {
        localStorage.setItem("volsim_token", data.token);
        startDashboard();
    } else {
        alert("Login Failed!");
        window.location.reload();
    }
}

async function updateDashboard() {
    const token = localStorage.getItem("volsim_token");
    try {
        const res = await fetch(`${API_URL}/pulse`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("volsim_token");
            window.location.reload();
        }

        const data = await res.json();
        document.getElementById('backend-status').innerText = "SECURE_LINK";
        document.getElementById('balance').innerText = data.balance;
        document.getElementById('btc-holdings').innerText = data.btc;
        document.getElementById('timestamp').innerText = new Date().toLocaleTimeString();
    } catch (err) {
        document.getElementById('backend-status').innerText = "AUTH_ERROR";
    }
}

function startDashboard() {
    setInterval(updateDashboard, 3000);
    updateDashboard();
}

if (!localStorage.getItem("volsim_token")) {
    attemptLogin();
} else {
    startDashboard();
}
