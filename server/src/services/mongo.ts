import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// const MONGO_URL = fs.readFileSync("mongo.key", "utf-8");
const { MONGO_URL } = process.env;

mongoose.connection.once("open", () =>
  console.log("MongoDB connection ready.")
);
mongoose.connection.once("close", () =>
  console.log("MongoDB connection closed.")
);
mongoose.connection.once("error", (err) => console.log(err));

export async function mongoConnect() {
  if (!MONGO_URL) throw new Error("MongoDB connection URL not exists in .env");
  await mongoose.connect(MONGO_URL);
}

export async function mongoDisconnect() {
  await mongoose.disconnect();
}
