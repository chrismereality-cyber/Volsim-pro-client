const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 10000;
app.use(cors());

let price = 65000;
let headline = "MARKET_STABLE";
let eventExpiry = 0;

const newsEvents = [
    { msg: "WHALE_ACCUMULATION_DETECTED", impact: 1.005 },
    { msg: "INSTITUTIONAL_FOMO_RISING", impact: 1.008 },
    { msg: "EXCHANGE_HACK_RUMORS", impact: 0.992 },
    { msg: "REGULATORY_CRACKDOWN_INITIATED", impact: 0.995 },
    { msg: "ELON_TWEET_DETECTED", impact: 1.012 }
];

setInterval(() => {
    // Normal volatility
    let change = (Math.random() - 0.5) * 0.002;
    
    // Apply news impact if active
    if (Date.now() < eventExpiry) {
        change += (Math.random() * 0.005); // Add extra pump/dump
    } else if (Math.random() > 0.98) {
        // Trigger new event
        const event = newsEvents[Math.floor(Math.random() * newsEvents.length)];
        headline = event.msg;
        price *= event.impact;
        eventExpiry = Date.now() + 10000; // Event lasts 10 seconds
    } else {
        headline = "TRADING_LATERAL";
    }

    price *= (1 + change);
}, 3000);

app.get("/api/data", (req, res) => {
    res.json({ price, headline, status: "LIVE" });
});

app.listen(PORT, "0.0.0.0", () => console.log("Engine V6 Live"));
