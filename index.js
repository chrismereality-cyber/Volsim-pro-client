const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Log every single request to the console so you can see it in Render Logs
app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
});

// The Data Route
app.get("/api/data", (req, res) => {
    res.json({
        price: 65000 + (Math.random() * 100),
        status: "STABLE",
        engine: "VOLSIM_V2"
    });
});

// A standard root route
app.get("/", (req, res) => {
    res.send("VOLSIM_ENGINE_V2_ONLINE");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
