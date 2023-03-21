import mongoose, { SchemaDefinition } from "mongoose";

import { Launch } from "./launches.model";

const launchDef: SchemaDefinition<Launch> = {
  flightNumber: { type: Number, required: true },
  mission: { type: String, required: true },
  rocket: { type: String, required: true },
  launchDate: { type: Date, required: true },
  target: { type: String, required: true },
  customers: [String],
  upcoming: { type: Boolean, required: true },
  success: { type: Boolean, required: true, default: true },
};
const launchesSchema = new mongoose.Schema(launchDef);
// * Connects launchesSchema with the "launches" collection
const launches = mongoose.model("Launch", launchesSchema);

export { launches };
