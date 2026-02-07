const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

let wealth = 1240270.80;
let btc = 0;
let price = 98000.00;
let history = [98000, 98010, 97990];

setInterval(() => {
    price += (Math.random() - 0.5) * 50;
    history.push(price);
    if (history.length > 50) history.shift();
}, 2000);

app.get("/", (req, res) => res.send("SYSTEM_ONLINE"));

app.get("/pulse", (req, res) => {
    res.json({
        balance: wealth.toLocaleString(undefined, {minimumFractionDigits: 2}),
        btc, price, history
    });
});

app.post("/command", (req, res) => {
    const c = (req.body.cmd || "").toLowerCase();
    if (c === "inject") wealth += 1000000;
    res.json({ ok: true });
});

app.listen(process.env.PORT || 10000, "0.0.0.0");
