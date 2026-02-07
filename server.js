const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();

app.use(cors());
app.use(express.json());

const SECRET_KEY = "volsim_ultra_secret_2026"; // In a real app, use an Env Var
const ADMIN_USER = { username: "chris", password: "password123" }; // Your credentials

let wealth = 1240270.80;
let btc = 0;
let price = 98000.00;

app.get("/", (req, res) => res.send("VOLSIM_AUTH_SERVER_V8"));

// LOGIN ROUTE
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
        const token = jwt.sign({ user: username }, SECRET_KEY, { expiresIn: "2h" });
        return res.json({ success: true, token });
    }
    res.status(401).json({ success: false, message: "Invalid Credentials" });
});

// PROTECTED PULSE ROUTE
app.get("/pulse", (req, res) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(403).send("Access Denied");
    
    try {
        jwt.verify(authHeader.split(" ")[1], SECRET_KEY);
        res.json({
            balance: wealth.toLocaleString(undefined, {minimumFractionDigits: 2}),
            btc, price
        });
    } catch (err) {
        res.status(401).send("Invalid Token");
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => console.log("AUTH_SERVER_ACTIVE"));
