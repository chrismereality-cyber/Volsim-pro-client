const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let wealth = 1240270.80;
let btc = 0;
let price = 98000.00;
let history = [98000, 98100, 97900, 98200];

// Root Check
app.get("/", (req, res) => res.send("VOLSIM_CORE_V4_RUNNING"));

// Pulse Check
app.get("/pulse", (req, res) => {
    res.json({
        balance: wealth.toLocaleString(undefined, {minimumFractionDigits: 2}),
        btc: btc,
        price: price,
        history: history
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
    console.log("SIGNAL_LIVE_ON_PORT_10000");
});
