import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import Router from "./routes/auth.js";

dotenv.config("./.env");

const app = express();
const port = process.env.SERVER_PORT || 3001;

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

app.use(express.json());
app.use(cors());

app.use(Router);

app.listen(port, (error) => {
    console.log(error ? error : `Server is listening on ${port}`);
});
