import express from "express";
import Router from "./routes/Route.js";
import dotenv from "dotenv";
import cors from "cors";
import path from "path"; 
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Compute __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()


dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.static("public"))
app.use(Router);

// Serve static files from the "public" directory
app.use('/images', express.static(path.join(__dirname, 'public/images')));
console.log('Static files served from:', path.join(__dirname, 'public/images'));

app.listen(process.env.APP_PORT, () => {
  console.log("Server up and running...");
});
