const express = require("express");
const cors = require("cors");
const app = express();

// Allow ABSOLUTELY EVERYTHING for debugging
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

// Root route to verify server is alive
app.get("/", (req, res) => res.send("SERVER_IS_ALIVE"));

app.get("/pulse", (req, res) => {
    res.json({
        balance: wealth.toLocaleString(undefined, {minimumFractionDigits: 2}),
        btc, price, history
    });
});

app.post("/command", (req, res) => {
    wealth += 1000000;
    res.json({ ok: true });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => console.log("LOCKED_AND_LOADED"));
