const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "data.json");

// Initialize data.json as an empty array
const initializeDataFile = () => {
  fs.writeFileSync(dataFilePath, JSON.stringify([]), (err) => {
    if (err) {
      console.error("Error initializing data file", err);
    }
  });
};

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

// Initialize the data file when the module is loaded
initializeDataFile();

module.exports = storePrice;
