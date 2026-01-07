// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");

const app = express();

// Allow server to read JSON data from requests
app.use(express.json());

// Database configuration using environment variables
const dbConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: true }
};

// Default route to check if server is running
app.get("/", (req, res) => {
    res.send("onlineCardAppWebService running");
});

// GET request to retrieve all cards from database
app.get("/allcards", async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute("SELECT * FROM cards");
        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST request to add a new card
app.post("/addcard", async (req, res) => {
    const { card_name, card_pic } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            "INSERT INTO cards (card_name, card_pic) VALUES (?, ?)",
            [card_name, card_pic]
        );
        await connection.end();
        res.status(201).json({ message: "Card added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Start server using Render assigned port or 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server started");
});
