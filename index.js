const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

let currentPrice = 65000;
let lastHeadline = "MARKET_IDLE: No major volatility detected.";

const headlines = [
    { text: "FEDERAL_RESERVE: Interest rates held steady.", impact: 0.001 },
    { text: "WHALE_ALERT: 5,000 BTC moved to cold storage.", impact: 0.005 },
    { text: "ELON_MUSK: 'Bitcoin is the future of Earth'.", impact: 0.02 },
    { text: "CYBER_SECURITY: Major exchange reports breach.", impact: -0.04 },
    { text: "RETAIL_ADOPTION: Coffee chain starts accepting BTC.", impact: 0.008 }
];

// Update logic: Every 10 seconds, maybe change the news
setInterval(() => {
    if (Math.random() > 0.7) {
        const event = headlines[Math.floor(Math.random() * headlines.length)];
        lastHeadline = event.text;
        currentPrice = currentPrice * (1 + event.impact);
    }
    // Natural jitter
    currentPrice += (Math.random() - 0.5) * 50;
}, 3000);

app.get("/", (req, res) => res.send("ENGINE_V5_LIVE"));

app.get("/api/data", (req, res) => {
    res.json({ 
        price: currentPrice, 
        headline: lastHeadline,
        timestamp: Date.now() 
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`VOLSIM_ENGINE_V5_ACTIVE_ON_${PORT}`);
});
