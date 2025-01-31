import express from "express";
import path from "path";
import fs from "fs";

const frontendApi = express.Router();

// Serve the SSR home page
frontendApi.get("/", (req, res) => {
  res.render("index", { title: "SSR Home", message: "Welcome to SSR via frontendApi!",clothingItems:[] });
});


// Serve clothing items in SSR
frontendApi.get("/clothing", (req, res) => {
  // Read mock data from JSON file
  fs.readFile(path.join(__dirname, "../mockData/clothing.json"), "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      return res.status(500).send("Internal Server Error");
    }
    const clothingItems = JSON.parse(data); // Parse JSON data
    res.render("index", { title: "Clothing Store",message:"", clothingItems });
  });
});

export { frontendApi };
