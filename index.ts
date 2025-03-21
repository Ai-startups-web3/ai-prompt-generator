
import express from "express";
import bodyParser from "body-parser";
//config from env file
import config from "./config";
// Importing modules from different folders
import router,{ initializeRootAdmin } from "./backend";
import { authApi } from "./auth";
import cors from 'cors';
import { setupSwagger } from './swagger';
import * as functions from "firebase-functions";

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

// Setup Swagger
setupSwagger(app);

// Mount APIs
app.use("/backend/v1", router);
app.use("/auth", authApi);

// Initialize Admin
initializeRootAdmin(rootAdmin, rootPassword);



// Export as a Firebase Cloud Function
export const api = functions.https.onRequest(app);