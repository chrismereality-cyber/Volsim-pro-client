const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const app = express();

app.use(cors());
app.use(express.json());

// --- ENVIRONMENT SECURITY ---
// These will pull from your Render "Environment" tab
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "password123";
const SECRET_KEY = process.env.JWT_SECRET || "volsim_secret";
const DATA_FILE = "/opt/render/project/src/data.json";

// --- STATE MANAGEMENT ---
let state = {
    wealth: 1240270.80,
    portfolio: { "BTC": 0.6, "XAU": 0.1, "ETH": 0, "EUR": 0, "JPY": 0.1 },
    prices: { "BTC": 98000, "XAU": 2050, "ETH": 2400, "EUR": 1.08, "JPY": 0.0067 },
    history: []
};

if (fs.existsSync(DATA_FILE)) {
    try { state = JSON.parse(fs.readFileSync(DATA_FILE)); } catch(e) { console.error("Data Load Error"); }
}

const saveState = () => {
    try { fs.writeFileSync(DATA_FILE, JSON.stringify(state)); } catch(e) { console.error("Data Save Error"); }
};

// --- MARKET ENGINE ---
setInterval(() => {
    Object.keys(state.prices).forEach(asset => {
        const vol = (asset === "BTC" || asset === "ETH") ? 0.003 : 0.0008;
        const change = 1 + (Math.random() * (vol * 2) - vol);
        state.prices[asset] = parseFloat((state.prices[asset] * change).toFixed(asset === "JPY" ? 6 : 2));
    });
}, 3000);

// --- AUTH MIDDLEWARE ---
const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, SECRET_KEY);
        next();
    } catch (e) { res.status(401).send("UNAUTHORIZED_ACCESS"); }
};

// --- ROUTES ---
app.get("/", (req, res) => res.send(`VOLSIM_CORE_V2_ONLINE_USER_${ADMIN_USER}`));

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        const token = jwt.sign({ user: ADMIN_USER }, SECRET_KEY, { expiresIn: "12h" });
        return res.json({ success: true, token });
    }
    res.status(401).json({ success: false, message: "INVALID_CREDENTIALS" });
});

app.get("/pulse", auth, (req, res) => {
    res.json({
        balance: state.wealth.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
        rawBalance: state.wealth,
        portfolio: state.portfolio,
        prices: state.prices,
        history: state.history.slice(-10).reverse()
    });
});

app.post("/trade", auth, (req, res) => {
    const { type, asset, amount } = req.body;
    const numAmt = parseFloat(amount);
    const price = state.prices[asset];
    const cost = numAmt * price;

    if (type === "BUY" && state.wealth >= cost) {
        state.wealth -= cost;
        state.portfolio[asset] = parseFloat(((state.portfolio[asset] || 0) + numAmt).toFixed(8));
    } else if (type === "SELL" && (state.portfolio[asset] || 0) >= (numAmt - 0.00000001)) {
        state.wealth += cost;
        state.portfolio[asset] = parseFloat((state.portfolio[asset] - numAmt).toFixed(8));
    } else {
        return res.status(400).json({ success: false, message: "TRADE_REJECTED" });
    }

    state.history.push({ type, asset, amount: numAmt, price, time: new Date().toLocaleTimeString() });
    saveState();
    res.json({ success: true });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`V2_STABLE_USER_${ADMIN_USER}_ONLINE`));
