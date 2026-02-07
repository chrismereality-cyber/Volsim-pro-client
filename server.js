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
let state = { wealth: 1240270.80, btc: 0.6, price: 98000.00 };

if (fs.existsSync(DATA_FILE)) {
    try { state = JSON.parse(fs.readFileSync(DATA_FILE)); } catch(e) {}
}

const saveState = () => {
    try { fs.writeFileSync(DATA_FILE, JSON.stringify(state)); } catch(e) {}
};

// V13 VOLATILITY ENGINE
setInterval(() => {
    const change = 1 + (Math.random() * 0.004 - 0.002); // +/- 0.2%
    state.price = parseFloat((state.price * change).toFixed(2));
}, 3000);

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, SECRET_KEY);
        next();
    } catch (e) { res.status(401).send("Unauthorized"); }
};

app.get("/", (req, res) => res.send("VOLSIM_PRO_V13_STABLE"));

app.get("/pulse", auth, (req, res) => {
    res.json({ 
        balance: state.wealth.toLocaleString(undefined, {minimumFractionDigits: 2}), 
        btc: state.btc.toFixed(4), 
        price: state.price 
    });
});

app.post("/trade", auth, (req, res) => {
    const { type, amountBTC } = req.body;
    const numAmt = parseFloat(amountBTC);
    const cost = numAmt * state.price;

    if (type === "BUY" && state.wealth >= cost) {
        state.wealth -= cost;
        state.btc += numAmt;
    } else if (type === "SELL" && state.btc >= numAmt) {
        state.wealth += cost;
        state.btc -= numAmt;
    } else {
        return res.status(400).json({ success: false });
    }
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
app.listen(PORT, () => console.log("V13_STABLE_READY"));
