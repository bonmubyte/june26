const express = require("express");
const http = require("http");
const cors = require("cors");
const storePrice = require("./storePrice");
const path = require("path");

const app = express();
const PORT = 5001;
const FINNHUB_API_KEY = "cpskb6pr01qkode1ls0gcpskb6pr01qkode1ls10";
const FINNHUB_SYMBOL = "NVDA";

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });

let clients = [];
let lastSentSecond = null;
let ws;

wss.on("connection", (ws) => {
  clients.push(ws);
  console.log("Client connected");

  ws.on("close", () => {
    console.log("Client disconnected");
    clients = clients.filter((client) => client !== ws);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

const connectToFinnhub = () => {
  if (ws) {
    ws.close();
  }

  ws = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`);

  ws.on("open", () => {
    ws.send(JSON.stringify({ type: "subscribe", symbol: FINNHUB_SYMBOL }));
    console.log("Connected to Finnhub WebSocket");
  });

  ws.on("message", (data) => {
    let message;
    try {
      message = JSON.parse(data);
    } catch (parseError) {
      console.error("Error parsing WebSocket message:", parseError);
      return;
    }

    if (message.type === "trade" && message.data && message.data[0]) {
      const trade = message.data[0];
      const now = new Date();
      const currentSecond = now.getSeconds();
      const formattedTime = now.toLocaleTimeString("en-US", {
        hour12: false,
        timeZone: "America/New_York",
      });
      const price = trade.p;

      console.log(`Received trade: ${formattedTime}, ${price}`);

      if (currentSecond !== lastSentSecond) {
        clients.forEach((client) =>
          client.send(JSON.stringify({ time: formattedTime, price }))
        );
        storePrice(formattedTime, price);
        lastSentSecond = currentSecond;
      }
    }
  });

  ws.on("close", () => {
    console.log("Finnhub WebSocket closed, reconnecting...");
    setTimeout(connectToFinnhub, 1000);
  });

  ws.on("error", (error) => {
    console.error("Finnhub WebSocket error:", error);
  });
};

connectToFinnhub();

// Serve the data.json file
app.use("/data.json", express.static(path.join(__dirname, "data.json")));

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
