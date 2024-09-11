import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import authRouter from "./routes/auth.js";
import mw from "./middlewares/authentication.js";
import dashRouter from "./routes/dashboard.js";
import pendingsCollector from "./utils/pendings_collector.js";

dotenv.config("./.env");

const app = express();
const port = process.env.SERVER_PORT || 3001;

mongoose
    .connect(process.env.MONGODB_URI, { autoIndex: true })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

app.use(express.json());
app.use(cors());

app.use(authRouter);
app.use(mw.authenticate);
app.use(dashRouter);

pendingsCollector.run();

app.listen(port, (error) => {
    console.log(error ? error : `Server is listening on ${port}`);
});
