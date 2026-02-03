const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 10000;
app.use(cors());

let price = 65000;
let headline = "SYSTEM_READY";

const newsEvents = [
    { msg: "WHALE_BUY_ORDER_DETECTED", impact: 1.02 },
    { msg: "EXCHANGE_FUD_SPREADING", impact: 0.97 },
    { msg: "INSTITUTIONAL_ADOPTION_NEWS", impact: 1.03 },
    { msg: "NETWORK_SECURITY_BREACH", impact: 0.95 },
    { msg: "ETHEREUM_UPGRADE_SUCCESS", impact: 1.01 },
    { msg: "Satoshi_Wallet_Wakes_Up", impact: 0.92 }
];

setInterval(() => {
    // Increase base volatility
    price *= (1 + (Math.random() - 0.5) * 0.005);
    
    // 25% chance to trigger a news event every 3 seconds
    if (Math.random() > 0.75) {
        const event = newsEvents[Math.floor(Math.random() * newsEvents.length)];
        headline = event.msg;
        price *= event.impact;
    } else {
        // 50% chance to revert to "Scanning" if no event
        if(Math.random() > 0.5) headline = "MARKET_ANALYSIS_IN_PROGRESS...";
    }
}, 3000);

app.get("/api/data", (req, res) => res.json({ price, headline }));
app.listen(PORT, "0.0.0.0", () => console.log("Chaos_Engine_V8_Live"));
