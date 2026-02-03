const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 10000;
app.use(cors());

let markets = {
    BTC: { price: 65000, color: "#0f0" },
    ETH: { price: 3500, color: "#88f" },
    SOL: { price: 145, color: "#f0f" }
};

setInterval(() => {
    Object.keys(markets).forEach(key => {
        let vol = key === "SOL" ? 0.008 : 0.004;
        markets[key].price *= (1 + (Math.random() - 0.5) * vol);
    });
}, 3000);

app.get("/api/data", (req, res) => {
    res.json({ markets, version: "V11_MULTI", status: "LIVE" });
});

app.listen(PORT, "0.0.0.0", () => console.log("Multi_Asset_V11_Live"));
