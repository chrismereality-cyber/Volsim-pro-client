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
let headline = "PORTFOLIO_SCAN_ACTIVE";

setInterval(() => {
    // Apply volatility to all assets
    Object.keys(markets).forEach(key => {
        let vol = key === "SOL" ? 0.008 : 0.004; // SOL is more volatile
        markets[key].price *= (1 + (Math.random() - 0.5) * vol);
    });

    if (Math.random() > 0.98) {
        headline = "??_SECTOR_WIDE_VOLATILITY_??";
    } else {
        headline = "MARKETS_DECOUPLED";
    }
}, 3000);

app.get("/api/data", (req, res) => res.json({ markets, headline }));
app.listen(PORT, "0.0.0.0", () => console.log("Multi_Asset_V11_Live"));
