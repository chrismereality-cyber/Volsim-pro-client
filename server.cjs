const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let wealth = 1240270.80;
let btc = 0;
let price = 98000.00;
let history = [98000, 98050, 97980];

app.get("/", (req, res) => res.send("Volsim_Core_CJS_Online"));

app.get("/pulse", (req, res) => {
    res.json({
        balance: wealth.toLocaleString(undefined, {minimumFractionDigits: 2}),
        btc: btc,
        price: price,
        history: history
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => console.log("SERVER_ACTIVE"));
