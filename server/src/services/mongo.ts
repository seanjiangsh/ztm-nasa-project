import fs from "fs";
import mongoose from "mongoose";

const MONGO_KEY = fs.readFileSync("mongo.key", "utf-8");

mongoose.connection.once("open", () =>
  console.log("MongoDB connection ready.")
);
mongoose.connection.once("close", () =>
  console.log("MongoDB connection closed.")
);
mongoose.connection.once("error", (err) => console.log(err));

export async function mongoConnect() {
  await mongoose.connect(MONGO_KEY);
}

export async function mongoDisconnect() {
  await mongoose.disconnect();
}
