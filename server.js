const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

let wealth = 1240270.80;
let btc = 0;
let price = 98000.00;
let history = [98000, 98100, 97900];

setInterval(() => {
    price += (Math.random() - 0.5) * 50;
    history.push(price);
    if (history.length > 50) history.shift();
}, 2000);

// NEW TEST ROUTE
app.get("/", (req, res) => res.send("V2_DEPLOYED_SUCCESSFULLY"));

// THE PULSE ROUTE
app.get("/pulse", (req, res) => {
    res.json({
        balance: wealth.toLocaleString(undefined, {minimumFractionDigits: 2}),
        btc, price, history
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => console.log("CORE_V2_READY"));
