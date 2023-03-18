import http from "http";
import fs from "fs";

import mongoose from "mongoose";

import app from "./app";
import { loadPlanetsData } from "./models/planets.model";

const PORT = process.env.PORT || 5000;
const MONGO_KEY = fs.readFileSync("mongo.key", "utf-8");

const server = http.createServer(app);

mongoose.connection.once("open", () =>
  console.log("MongoDB connection ready.")
);
mongoose.connection.once("error", (err) => console.log(err));

async function startServer() {
  await mongoose.connect(MONGO_KEY);
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

startServer();

process.on("uncaughtException", (err) => {
  console.error("Process uncaught exception", err);
});
