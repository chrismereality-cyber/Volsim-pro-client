const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 10000;
app.use(cors());

let price = 65000;
let headline = "SYSTEM_STABLE";

setInterval(() => {
    let change = (Math.random() - 0.5) * 0.006; // Standard Vol
    
    // BLACK SWAN EVENT (1% chance every 3 seconds)
    if (Math.random() > 0.99) {
        const crash = 0.70 + (Math.random() * 0.15); // 15% to 30% drop
        price *= crash;
        headline = "??_BLACK_SWAN_EVENT_DETECTED_??";
    } else if (Math.random() > 0.90) {
        headline = "VOLATILITY_RISING";
    } else {
        headline = "SCANNING_MARKET...";
    }

    price *= (1 + change);
}, 3000);

app.get("/api/data", (req, res) => res.json({ price, headline }));
app.listen(PORT, "0.0.0.0", () => console.log("Black_Swan_V10_Live"));
