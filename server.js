const express = require("express");
const cors = require("cors");
const app = express();

// Enable CORS for your specific Netlify domain
app.use(cors({
    origin: ["https://volsim-pro-client.netlify.app", "https://rococo-chimera-31754c.netlify.app"],
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json());

let wealth = 1240270.80;
let btc = 0;
let price = 98000.00;
let history = Array.from({length: 20}, () => 98000 + (Math.random() - 0.5) * 100);

setInterval(() => {
    price += (Math.random() - 0.5) * 50;
    history.push(price);
    if (history.length > 50) history.shift();
}, 2000);

app.get("/pulse", (req, res) => {
    res.json({
        balance: wealth.toLocaleString(undefined, {minimumFractionDigits: 2}),
        btc, price, history
    });
});

app.post("/command", (req, res) => {
    const c = (req.body.cmd || "").toLowerCase();
    if (c === "inject") wealth += 1000000;
    res.json({ success: true });
});

// CRITICAL: Bind to 0.0.0.0 and use Render's PORT
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server live on port ${PORT}`);
});
