const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();

app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET || "volsim_default_secret";
const ADMIN_USER = process.env.ADMIN_USER || "admin"; 
const ADMIN_PASS = process.env.ADMIN_PASS || "password123";

// State (In-memory for now)
let wealth = 1240270.80;
let btc = 0;
let price = 98000.00;

app.get("/", (req, res) => res.send("VOLSIM_TRADING_ENGINE_V12_ACTIVE"));

// Middleware to protect routes
const authenticate = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(403).json({ error: "Missing Token" });
    try {
        jwt.verify(authHeader.split(" ")[1], SECRET_KEY);
        next();
    } catch (err) { res.status(401).json({ error: "Invalid Session" }); }
};

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        const token = jwt.sign({ user: username }, SECRET_KEY, { expiresIn: "4h" });
        return res.json({ success: true, token });
    }
    res.status(401).json({ success: false });
});

app.get("/pulse", authenticate, (req, res) => {
    res.json({ balance: wealth.toFixed(2), btc: btc.toFixed(4), price });
});

// NEW: TRADE ROUTE
app.post("/trade", authenticate, (req, res) => {
    const { amountBTC } = req.body; // e.g. 0.5
    const cost = amountBTC * price;

    if (wealth >= cost) {
        wealth -= cost;
        btc += parseFloat(amountBTC);
        res.json({ success: true, newBalance: wealth, newBTC: btc });
    } else {
        res.status(400).json({ success: false, message: "Insufficient Funds" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => console.log("V12_TRADING_READY"));
