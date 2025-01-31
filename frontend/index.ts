import express from "express";
import path from "path";
import fs from "fs";

const frontendApi = express.Router();

// Serve the SSR home page
frontendApi.get("/", async (req, res) => {
  // Call the backend API to get the prompt response
  try {
    const response = await fetch("http://localhost:3000/backend/getPrompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userText: "Give me an AI prompt!" }) // Send user text as input
    });
    const data = await response.json();
    console.log("data",data);
    
    res.render("index", { 
      title: "SSR Home", 
      message: "Welcome to SSR via frontendApi!", 
      promptResponse: data.message || "No prompt response yet",
      clothingItems: null 
    });
  } catch (error) {
    console.error("Error fetching prompt:", error);
    res.render("index", { 
      title: "SSR Home", 
      message: "Failed to get prompt response", 
      clothingItems: null 
    });
  }
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
