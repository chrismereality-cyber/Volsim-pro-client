const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();

app.use(cors());
app.use(express.json());

// Accessing the hidden variables from Render's Environment
const SECRET_KEY = process.env.JWT_SECRET || "fallback_secret_do_not_use_in_prod";
const ADMIN_USER = { 
    username: "chris", 
    password: process.env.ADMIN_PASS || "fallback_pass" 
};

let wealth = 1240270.80;
let btc = 0;
let price = 98000.00;

app.get("/", (req, res) => res.send("VOLSIM_SECURE_VAULT_V9_ACTIVE"));

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
        const token = jwt.sign({ user: username }, SECRET_KEY, { expiresIn: "4h" });
        return res.json({ success: true, token });
    }
    res.status(401).json({ success: false, message: "Invalid Credentials" });
});

app.get("/pulse", (req, res) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(403).json({ error: "No Token Provided" });
    
    try {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, SECRET_KEY);
        res.json({
            balance: wealth.toLocaleString(undefined, {minimumFractionDigits: 2}),
            btc, price
        });
    } catch (err) {
        res.status(401).json({ error: "Session Expired" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => console.log("SECURE_SERVER_RUNNING"));
