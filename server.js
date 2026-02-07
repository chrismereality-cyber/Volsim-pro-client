const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();

app.use(cors());
app.use(express.json());

// Pulling everything from Render Env Vars
const SECRET_KEY = process.env.JWT_SECRET || "volsim_default_secret";
const ADMIN_USER = process.env.ADMIN_USER || "admin"; 
const ADMIN_PASS = process.env.ADMIN_PASS || "password123";

app.get("/", (req, res) => res.send("AUTH_VAULT_V11_READY"));

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    
    console.log(`Attempt - User: ${username}`);

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        console.log("SUCCESS: Login granted.");
        const token = jwt.sign({ user: username }, SECRET_KEY, { expiresIn: "4h" });
        return res.json({ success: true, token });
    }
    
    console.log("FAILURE: Invalid credentials.");
    res.status(401).json({ success: false, message: "Invalid Credentials" });
});

app.get("/pulse", (req, res) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(403).json({ error: "Missing Token" });
    try {
        jwt.verify(authHeader.split(" ")[1], SECRET_KEY);
        res.json({ balance: "1,240,270.80", btc: 0, price: 98000 });
    } catch (err) { res.status(401).json({ error: "Session Expired" }); }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => console.log("V11_SECURE_RUNNING"));
