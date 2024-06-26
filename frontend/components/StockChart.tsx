import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment-timezone";
import styles from "../styles/StockChart.module.css";

const StockChart: React.FC = () => {
  const [stockData, setStockData] = useState({
    price: "0",
    marketCap: "0",
    time: "",
    marketStatus: "Market Closed",
  });

  const [currentTime, setCurrentTime] = useState("");
  const [preMarketPrice, setPreMarketPrice] = useState("0");
  const [postMarketPrice, setPostMarketPrice] = useState("0");

  const updateCurrentTimeAndMarketStatus = () => {
    const now = moment().tz("America/New_York");
    const formattedTime = now.format("HH:mm:ss");
    setCurrentTime(formattedTime);

    const marketOpen = now.clone().set({ hour: 9, minute: 30, second: 0 });
    const marketClose = now.clone().set({ hour: 16, minute: 0, second: 0 });
    const preMarketOpen = now.clone().set({ hour: 4, minute: 0, second: 0 });
    const postMarketClose = now.clone().set({ hour: 20, minute: 0, second: 0 });

    let marketStatus = "Market Closed";
    if (now.isBetween(preMarketOpen, marketOpen)) {
      marketStatus = "Pre-Market";
    } else if (now.isBetween(marketOpen, marketClose)) {
      marketStatus = "Market Open";
    } else if (now.isBetween(marketClose, postMarketClose)) {
      marketStatus = "Post-Market";
    }

    console.log(`Current Time: ${formattedTime}`);
    console.log(`Market Status: ${marketStatus}`);

    setStockData((prevData) => ({
      ...prevData,
      marketStatus,
      time: formattedTime,
    }));
  };

  useEffect(() => {
    const intervalId = setInterval(updateCurrentTimeAndMarketStatus, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchQuoteData = async () => {
    try {
      console.log("Fetching stock data from API");
      const response = await axios.get("http://localhost:5001/api/stock-data");
      const data = response.data;
      console.log("API Response:", data);

      setStockData((prevData) => ({
        ...prevData,
        price: data.c ? data.c.toFixed(2) : "0",
        marketCap: data.c ? (data.c * 629000000).toLocaleString() : "0",
      }));
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const connectWebSocket = () => {
    const socket = new WebSocket("ws://localhost:5001");

    socket.addEventListener("open", () => {
      console.log("WebSocket connection opened");
    });

    socket.addEventListener("message", async (event) => {
      console.log("WebSocket message received:", event.data);
      try {
        let messageData;
        if (event.data instanceof Blob) {
          const text = await event.data.text();
          messageData = JSON.parse(text);
        } else {
          messageData = JSON.parse(event.data);
        }

        console.log("Parsed WebSocket message:", messageData);

        if (messageData.price !== undefined) {
          const price = parseFloat(messageData.price);
          const time = moment().tz("America/New_York").format("HH:mm:ss");
          console.log(`(x, y) = (${time}, ${price})`);
          console.log(`Current Price Value: ${price}`);

          if (stockData.marketStatus === "Pre-Market") {
            console.log(`Updating preMarketPrice to: ${price}`);
            setPreMarketPrice(price.toFixed(2));
          } else if (stockData.marketStatus === "Market Open") {
            setStockData((prevData) => ({
              ...prevData,
              price: price.toFixed(2),
              marketCap: (price * 629000000).toLocaleString(),
            }));
          } else if (stockData.marketStatus === "Post-Market") {
            console.log(`Updating postMarketPrice to: ${price}`);
            setPostMarketPrice(price.toFixed(2));
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });

    socket.addEventListener("close", () => {
      console.log("WebSocket connection closed");
      setTimeout(connectWebSocket, 1000);
    });

    return () => socket.close();
  };

  useEffect(() => {
    fetchQuoteData();
    const stockDataIntervalId = setInterval(fetchQuoteData, 2000);

    const webSocketCleanup = connectWebSocket();

    return () => {
      clearInterval(stockDataIntervalId);
      webSocketCleanup();
    };
  }, [stockData]);

  return (
    <div className={styles.container}>
      <div>
        <h2>Latest News</h2>
        <h3>Current Time (EST): {currentTime}</h3>
        <h3>Market Status: {stockData.marketStatus}</h3>
        <h3>Current NVDA Price: ${stockData.price}</h3>
        {stockData.marketStatus === "Pre-Market" && (
          <>
            <h3>Pre-Market NVDA Price: ${preMarketPrice}</h3>
            <h3>
              Current NVDA Market Cap:{" "}
              {(parseFloat(preMarketPrice) * 629000000).toLocaleString()}
            </h3>
          </>
        )}
        {stockData.marketStatus === "Post-Market" && (
          <>
            <h3>Post-Market NVDA Price: ${postMarketPrice}</h3>
            <h3>
              Current NVDA Market Cap:{" "}
              {(parseFloat(postMarketPrice) * 629000000).toLocaleString()}
            </h3>
          </>
        )}
      </div>
    </div>
  );
};

export default StockChart;
