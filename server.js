const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const app = express();

app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET || "volsim_secret";
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "password123";

// --- PERSISTENCE LOGIC ---
const DATA_FILE = "./data.json";
let state = { 
    wealth: 1240270.80, 
    btc: 0.1, 
    price: 98000.00 
};

// Load saved data if it exists
if (fs.existsSync(DATA_FILE)) {
    state = JSON.parse(fs.readFileSync(DATA_FILE));
}

const saveState = () => fs.writeFileSync(DATA_FILE, JSON.stringify(state));

// --- PRICE VOLATILITY ENGINE ---
setInterval(() => {
    const change = 1 + (Math.random() * 0.01 - 0.005); // +/- 0.5%
    state.price = +(state.price * change).toFixed(2);
    // Note: We don't saveState here to avoid constant disk writing, 
    // only on trades.
}, 3000);

// --- AUTH MIDDLEWARE ---
const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, SECRET_KEY);
        next();
    } catch (e) { res.status(401).send("Unauthorized"); }
};

app.get("/", (req, res) => res.send("VOLSIM_PRO_LIVE_ENGINE_V13"));

app.post("/login", (req, res) => {
    if (req.body.username === ADMIN_USER && req.body.password === ADMIN_PASS) {
        const token = jwt.sign({ user: ADMIN_USER }, SECRET_KEY, { expiresIn: "4h" });
        return res.json({ success: true, token });
    }
    res.status(401).json({ success: false });
});

app.get("/pulse", auth, (req, res) => {
    res.json({ 
        balance: state.wealth.toLocaleString(undefined, {minimumFractionDigits: 2}), 
        btc: state.btc.toFixed(4), 
        price: state.price 
    });
});

app.post("/trade", auth, (req, res) => {
    const { type, amountBTC } = req.body;
    const cost = amountBTC * state.price;

    if (type === "BUY") {
        if (state.wealth >= cost) {
            state.wealth -= cost;
            state.btc += parseFloat(amountBTC);
        } else return res.status(400).json({ message: "Insufficient Cash" });
    } else if (type === "SELL") {
        if (state.btc >= amountBTC) {
            state.wealth += cost;
            state.btc -= parseFloat(amountBTC);
        } else return res.status(400).json({ message: "Insufficient BTC" });
    }

    saveState();
    res.json({ success: true });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("V13_ENGINE_ONLINE"));
