const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();

app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET || "volsim_default_secret";
const ADMIN_USER = { 
    username: "chris", 
    password: process.env.ADMIN_PASS 
};

app.get("/", (req, res) => res.send("AUTH_VAULT_V10_READY"));

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    
    // Log for debugging (You can see this in Render Logs)
    console.log(`Login attempt for: ${username}`);
    
    if (!process.env.ADMIN_PASS) {
        console.error("CRITICAL: ADMIN_PASS Environment Variable is NOT set in Render!");
        return res.status(500).json({ success: false, message: "Server Config Error" });
    }

    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
        console.log("Login Successful");
        const token = jwt.sign({ user: username }, SECRET_KEY, { expiresIn: "4h" });
        return res.json({ success: true, token });
    }
    
    console.log("Login Failed: Invalid credentials");
    res.status(401).json({ success: false, message: "Invalid Credentials" });
});

app.get("/pulse", (req, res) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(403).json({ error: "Missing Token" });
    
    try {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, SECRET_KEY);
        res.json({ balance: "1,240,270.80", btc: 0, price: 98000 });
    } catch (err) {
        res.status(401).json({ error: "Session Expired" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => console.log("V10_RUNNING"));
