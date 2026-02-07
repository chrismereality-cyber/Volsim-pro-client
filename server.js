const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let wealth = 1240270.80;
let btc = 0;
let price = 98000.00;
let history = [98000, 98100, 97900, 98200];

// This matches the text Render is currently showing, but adds the pulse logic
app.get("/", (req, res) => res.send("Volsim Pro API is running - PULSE_ENABLED_V6"));

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
    console.log("SERVER_LIVE_V6");
});
