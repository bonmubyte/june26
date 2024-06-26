const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "priceData.json");

const storePrice = (time, price) => {
  fs.readFile(dataFilePath, (err, data) => {
    let jsonData = [];
    if (!err && data.length) {
      try {
        jsonData = JSON.parse(data);
      } catch (parseError) {
        console.error("Error parsing JSON data:", parseError);
        return;
      }
    }

    // Append new data
    jsonData.push({ time, price });

    // Write updated data to file
    fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error("Error writing to file", err);
      }
    });
  });
};

module.exports = storePrice;
