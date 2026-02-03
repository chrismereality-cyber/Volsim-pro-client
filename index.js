const express = require("express");
const cors = require("cors");
const app = express();

// Render passes the port as an environment variable
const PORT = process.env.PORT || 10000;

app.use(cors());

// The Health Check (Crucial for Render to "detect" the port)
app.get("/", (req, res) => {
    res.status(200).send("ALIVE");
});

app.get("/api/data", (req, res) => {
    res.json({ 
        price: 65000 + Math.random() * 100, 
        status: "LIVE" 
    });
});

// We must bind to 0.0.0.0 for Render to see the port
app.listen(PORT, "0.0.0.0", () => {
    console.log(`SERVER_LISTENING_ON_PORT_${PORT}`);
});
