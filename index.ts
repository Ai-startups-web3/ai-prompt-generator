
import express from "express";
import bodyParser from "body-parser";
//config from env file
import config from "./config";
// Importing modules from different folders
import { frontendApi } from "./frontend";
import { initializeRootAdmin, backendApi } from "./backend";
import { authApi } from "./auth";

const app = express();
const { port, env, rootAdmin, rootPassword } = config;

// Middleware for parsing JSON
app.use(bodyParser.json());

// Mount APIs
app.use("/frontend", frontendApi);
app.use("/backend", backendApi);
app.use("/auth", authApi);

// Initialize Admin
initializeRootAdmin(rootAdmin, rootPassword);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port} in ${env} mode`);
});