import mongoose, { SchemaDefinition } from "mongoose";

import { Planet } from "./planets.model";

const plantDef: SchemaDefinition<Planet> = {
  keplerName: { type: String, required: true },
  // koi_disposition: {
  //   type: String,
  //   required: true,
  //   enum: ["CONFIRMED", "CANDIDATE", "FALSE POSITIVE"],
  // },
  // koi_insol: { type: Number, required: true },
  // koi_prad: { type: Number, required: true },
};
const planetSchema = new mongoose.Schema(plantDef);
// * Connects planetsSchema with the "planets" collection
const planets = mongoose.model("Planet", planetSchema);

export { planets };
