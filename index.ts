
import express from "express";
import bodyParser from "body-parser";
//config from env file
import config from "./config";
// Importing modules from different folders
import { initializeRootAdmin, backendApi } from "./backend";
import { authApi } from "./auth";
import cors from 'cors';

const app = express();
const { port, env, rootAdmin, rootPassword } = config;

// Middleware for parsing JSON
app.use(bodyParser.json());

// CORS configuration
app.use(cors({
    origin: '*', // or specify the domain explicitly
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'boundary'],
  }));

// Mount APIs
app.use("/backend/v1", backendApi);
app.use("/auth", authApi);

// Initialize Admin
initializeRootAdmin(rootAdmin, rootPassword);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port} in ${env} mode`);
});