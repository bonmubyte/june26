const express = require("express");
const axios = require("axios");
const http = require("http");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5001;
const FINNHUB_API_KEY = "cpskb6pr01qkode1ls0gcpskb6pr01qkode1ls10";
const FINNHUB_SYMBOL = "NVDA";
const DATA_FILE = "data.json";

app.use(cors());
app.use(express.json());

app.get("/api/stock-data", async (req, res) => {
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${FINNHUB_SYMBOL}&token=${FINNHUB_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching stock data");
  }
});

app.post("/api/store-data", (req, res) => {
  const { time, price } = req.body;

  // Read existing data
  fs.readFile(DATA_FILE, (err, data) => {
    let jsonData = [];
    if (!err && data.length) {
      try {
        jsonData = JSON.parse(data);
      } catch (parseError) {
        console.error("Error parsing JSON data:", parseError);
        return res.status(500).json({ message: "Error parsing JSON data" });
      }
    }

    // Append new data
    jsonData.push({ time, price });

    // Write updated data to file
    fs.writeFile(DATA_FILE, JSON.stringify(jsonData), (err) => {
      if (err) {
        return res.status(500).json({ message: "Error writing to file" });
      }
      res.status(200).json({ message: "Data stored successfully" });
    });
  });
});

app.get("/api/get-data", (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading from file" });
    }
    try {
      const jsonData = JSON.parse(data);
      res.status(200).json(jsonData);
    } catch (parseError) {
      console.error("Error parsing JSON data:", parseError);
      res.status(500).json({ message: "Error parsing JSON data" });
    }
  });
});

const server = http.createServer(app);

const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on("connection", (ws) => {
  clients.push(ws);
  console.log("Client connected");

  ws.on("close", () => {
    console.log("Client disconnected");
    clients = clients.filter((client) => client !== ws);
  });
});

const sendStockData = () => {
  const ws = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`);

  ws.on("open", () => {
    ws.send(JSON.stringify({ type: "subscribe", symbol: FINNHUB_SYMBOL }));
  });

  ws.on("message", async (data) => {
    let message;
    try {
      message = JSON.parse(data);
    } catch (parseError) {
      console.error("Error parsing WebSocket message:", parseError);
      return;
    }

    if (message.type === "trade" && message.data && message.data[0]) {
      const trade = message.data[0];
      const time = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        timeZone: "America/New_York",
      });
      const price = trade.p;
      console.log(`Received trade: ${time}, ${price}`);

      try {
        await axios.post("http://localhost:5001/api/store-data", {
          time: time,
          price: price,
        });
      } catch (axiosError) {
        console.error("Error storing data:", axiosError);
      }

      clients.forEach((client) => client.send(JSON.stringify({ time, price })));
    }
  });

  ws.on("close", () => {
    console.log("Finnhub WebSocket closed, reconnecting...");
    setTimeout(sendStockData, 1000);
  });

  ws.on("error", (error) => {
    console.error("Finnhub WebSocket error:", error);
  });
};

sendStockData();

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
