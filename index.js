const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 10000;
app.use(cors());

let price = 65000;
let headline = "SYSTEM_IDLE"; // Default starting headline

const newsEvents = [
    { msg: "WHALE_ACCUMULATION_DETECTED", impact: 1.005 },
    { msg: "INSTITUTIONAL_FOMO_RISING", impact: 1.008 },
    { msg: "EXCHANGE_HACK_RUMORS", impact: 0.992 },
    { msg: "REGULATORY_CRACKDOWN_INITIATED", impact: 0.995 }
];

setInterval(() => {
    price *= (1 + (Math.random() - 0.5) * 0.002);
    
    // 10% chance to change the headline every 3 seconds
    if (Math.random() > 0.90) {
        const event = newsEvents[Math.floor(Math.random() * newsEvents.length)];
        headline = event.msg;
        price *= event.impact;
    } else if (Math.random() > 0.95) {
        headline = "SCANNING_CHANNELS...";
    }
}, 3000);

app.get("/api/data", (req, res) => {
    res.json({ price, headline, status: "LIVE" });
});

app.listen(PORT, "0.0.0.0", () => console.log("Engine_V7_Live"));
