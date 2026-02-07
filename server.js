const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// State
let wealth = 1240270.80;
let btc = 0;
let price = 98000.00;
let history = [98000, 98050, 97980, 98100];

// Logic
setInterval(() => {
    price += (Math.random() - 0.5) * 50;
    history.push(price);
    if (history.length > 50) history.shift();
}, 2000);

// THIS IS THE ROUTE THAT IS MISSING
app.get("/pulse", (req, res) => {
    res.json({
        balance: wealth.toLocaleString(undefined, {minimumFractionDigits: 2}),
        btc: btc,
        price: price,
        history: history
    });
});

// Fallback route
app.get("/", (req, res) => {
    res.send("SERVER_IS_ACTIVE_PULSE_AT_/PULSE");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
    console.log("HEALTH_CHECK_PASSED");
});
