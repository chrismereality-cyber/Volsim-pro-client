const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Allows all origins for now to guarantee connection
app.use(express.json());

// THIS IS THE CRITICAL ROUTE
app.get("/api/data", (req, res) => {
    console.log("Data requested at:", new Date().toISOString());
    res.json({
        price: 65000 + (Math.random() * 100),
        status: "STABLE",
        engine: "VOLSIM_V2"
    });
});

// Root route so you know it's working
app.get("/", (req, res) => {
    res.send("VOLSIM_ENGINE_V2_STABLE_ONLINE");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
