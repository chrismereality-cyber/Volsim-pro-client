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
const DATA_FILE = "/opt/render/project/src/data.json";

// V14 Global Asset Initializer
let state = {
    wealth: 1240270.80,
    portfolio: { "BTC": 0.6, "XAU": 0, "ETH": 0, "EUR": 0, "JPY": 0 },
    prices: { "BTC": 98000, "XAU": 2050, "ETH": 2400, "EUR": 1.08, "JPY": 0.0067 },
    history: []
};

if (fs.existsSync(DATA_FILE)) {
    try { state = JSON.parse(fs.readFileSync(DATA_FILE)); } catch(e) {}
}

const saveState = () => fs.writeFileSync(DATA_FILE, JSON.stringify(state));

// GLOBAL VOLATILITY ENGINE (Updates every 3s)
setInterval(() => {
    Object.keys(state.prices).forEach(asset => {
        const volatility = asset === "BTC" || asset === "ETH" ? 0.005 : 0.001; // Crypto is swingier
        const change = 1 + (Math.random() * (volatility * 2) - volatility);
        state.prices[asset] = parseFloat((state.prices[asset] * change).toFixed(asset === "JPY" ? 6 : 2));
    });
}, 3000);

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, SECRET_KEY);
        next();
    } catch (e) { res.status(401).send("Unauthorized"); }
};

app.get("/pulse", auth, (req, res) => {
    res.json({
        balance: state.wealth.toLocaleString(undefined, {minimumFractionDigits: 2}),
        rawBalance: state.wealth,
        portfolio: state.portfolio,
        prices: state.prices,
        history: state.history.slice(-10).reverse() // Last 10 trades
    });
});

app.post("/trade", auth, (req, res) => {
    const { type, asset, amount } = req.body;
    const numAmt = parseFloat(amount);
    const price = state.prices[asset];
    const cost = numAmt * price;

    if (type === "BUY" && state.wealth >= cost) {
        state.wealth -= cost;
        state.portfolio[asset] = (state.portfolio[asset] || 0) + numAmt;
    } else if (type === "SELL" && state.portfolio[asset] >= numAmt) {
        state.wealth += cost;
        state.portfolio[asset] -= numAmt;
    } else {
        return res.status(400).json({ success: false, message: "Invalid Trade" });
    }

    state.history.push({
        type, asset, amount: numAmt, price, time: new Date().toLocaleTimeString()
    });
    
    saveState();
    res.json({ success: true });
});

app.post("/login", (req, res) => {
    if (req.body.username === ADMIN_USER && req.body.password === ADMIN_PASS) {
        const token = jwt.sign({ user: ADMIN_USER }, SECRET_KEY, { expiresIn: "4h" });
        return res.json({ success: true, token });
    }
    res.status(401).json({ success: false });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("V14_GLOBAL_READY"));
