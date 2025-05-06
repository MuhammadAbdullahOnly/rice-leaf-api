// Import required modules
const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Set up multer for handling file uploads
const upload = multer({ dest: "uploads/" });

// API endpoint to handle image upload and inference
app.post("/upload", upload.single("image"), (req, res) => {
  const imagePath = req.file.path;
  
  // Read the image and encode it in base64
  const image = fs.readFileSync(imagePath, { encoding: "base64" });

  // Send the image to Roboflow for inference
  axios({
    method: "POST",
    url: "https://serverless.roboflow.com/rice-plant-leaf-disease-classification/1",
    params: { api_key: "dwBev3Ca6CeGLv8tpw25" },  // Replace with your actual Roboflow API key
    data: image,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((response) => {
      // Return the prediction response from Roboflow
      res.json({ prediction: response.data });
    })
    .catch((error) => {
      res.status(500).send("Error occurred while processing the image.");
    });
});

// Default route for testing if the server is running
app.get("/", (req, res) => {
  res.send("API is running");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
