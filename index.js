import express from "express";
import Router from "./routes/Route.js";
import dotenv from "dotenv";
import cors from "cors";

const app = express()


dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.static("public"))
app.use(Router);

app.listen(process.env.APP_PORT, () => {
  console.log("Server up and running...");
});
