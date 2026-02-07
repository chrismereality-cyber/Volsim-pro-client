const API_URL = "https://volsim-pro.onrender.com";

async function login() {
    // 1. Check if we already have a token
    if (localStorage.getItem("volsim_token")) {
        startDashboard();
        return;
    }

    // 2. If no token, ask for credentials
    const user = prompt("Username (Hint: chris):");
    const pass = prompt("Password:");

    if (!user || !pass) {
        alert("Credentials required to access Volsim Core.");
        window.location.reload();
        return;
    }

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: user, password: pass })
        });

        const data = await res.json();

        if (res.ok && data.success) {
            localStorage.setItem("volsim_token", data.token);
            alert("Access Granted.");
            startDashboard();
        } else {
            alert("Access Denied: " + (data.message || "Invalid Login"));
            // DON'T reload automatically, let the user click a button or refresh manually
        }
    } catch (err) {
        alert("Connection Error. Is the Render server awake?");
    }
}

function startDashboard() {
    // This is where your updateDashboard() and setInterval go
    console.log("System Online...");
    updateDashboard();
    setInterval(updateDashboard, 3000);
}

login();
