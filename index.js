const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 10000;

// This allows ANY website to talk to your backend - perfect for testing
app.use(cors());

let markets = {
    BTC: { price: 65000, headline: "BTC_MARKET_STABLE" },
    ETH: { price: 3500, headline: "ETH_CONSOLIDATING" }
};

const newsPool = [
    { text: "INSTITUTIONAL_BUYING: BTC Supply Shrinking", coin: "BTC", impact: 1.05 },
    { text: "VITALIK_UPDATE: Ethereum Gas Fees Dropping", coin: "ETH", impact: 1.08 },
    { text: "ETHEREUM_ETF: Massive Inflows Detected", coin: "ETH", impact: 1.12 },
    { text: "EXCHANGE_FUD: Regulatory Pressure on Altcoins", coin: "ETH", impact: 0.90 }
];

setInterval(() => {
    markets.BTC.price *= (1 + (Math.random() - 0.5) * 0.002);
    markets.ETH.price *= (1 + (Math.random() - 0.5) * 0.003);

    if (Math.random() > 0.8) {
        const event = newsPool[Math.floor(Math.random() * newsPool.length)];
        markets[event.coin].price *= event.impact;
        markets[event.coin].headline = event.text;
    }
}, 3000);

// Basic test route to check in browser
app.get("/", (req, res) => res.send("VOLSIM_BACKEND_IS_ALIVE"));

app.get("/api/data", (req, res) => {
    console.log("Data requested at", new Date().toISOString());
    res.json(markets);
});

app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
