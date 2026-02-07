const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const app = express();

app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET || "volsim_secret";
const DATA_FILE = "/opt/render/project/src/data.json";

let state = {
    wealth: 1240270.80,
    portfolio: { "BTC": 0.6, "XAU": 0.1, "ETH": 0, "EUR": 0, "JPY": 0.1 },
    prices: { "BTC": 98000, "XAU": 2050, "ETH": 2400, "EUR": 1.08, "JPY": 0.0067 },
    history: []
};

if (fs.existsSync(DATA_FILE)) {
    try { state = JSON.parse(fs.readFileSync(DATA_FILE)); } catch(e) {}
}

const saveState = () => fs.writeFileSync(DATA_FILE, JSON.stringify(state));

setInterval(() => {
    Object.keys(state.prices).forEach(asset => {
        const vol = (asset === "BTC" || asset === "ETH") ? 0.003 : 0.0008;
        state.prices[asset] = parseFloat((state.prices[asset] * (1 + (Math.random() * (vol * 2) - vol))).toFixed(asset === "JPY" ? 6 : 2));
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

    if (type === "BUY") {
        if (state.wealth >= (cost - 0.01)) { // Added tiny margin for rounding
            state.wealth -= cost;
            state.portfolio[asset] = parseFloat(((state.portfolio[asset] || 0) + numAmt).toFixed(8));
        } else return res.status(400).json({ success: false, message: "INSUFFICIENT_CASH" });
    } else if (type === "SELL") {
        // Use a tiny epsilon (0.00000001) to handle floating point math
        if ((state.portfolio[asset] || 0) >= (numAmt - 0.00000001)) {
            state.wealth += cost;
            state.portfolio[asset] = parseFloat((state.portfolio[asset] - numAmt).toFixed(8));
        } else return res.status(400).json({ success: false, message: "INSUFFICIENT_ASSET" });
    }

    state.history.push({ type, asset, amount: numAmt, price, time: new Date().toLocaleTimeString() });
    saveState();
    res.json({ success: true });
});

app.get("/", (req, res) => res.send("VOLSIM_ENGINE_V14.3_STABLE"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("V14.3_ONLINE"));
