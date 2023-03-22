import fs from "fs";

import { parse } from "csv-parse";
import { planets } from "./planets.mongo";

type Planet = {
  keplerName: string;
  koi_disposition: "CONFIRMED" | "CANDIDATE" | "FALSE POSITIVE";
  koi_insol: number;
  koi_prad: number;
};

const UPSERT = { upsert: true };
const FIND_OPTION = { _id: 0, __v: 0 }; // * remove MongoDB buildin property

function isHabitablePlanet(planet: Planet) {
  const { koi_disposition, koi_insol, koi_prad } = planet;
  return (
    koi_disposition === "CONFIRMED" &&
    koi_insol > 0.35 &&
    koi_insol < 1.11 &&
    koi_prad < 1.6
  );
}

async function loadPlanetsData() {
  return new Promise<void>((resolve, reject) => {
    fs.createReadStream("data/kepler_data.csv")
      .pipe(parse({ comment: "#", columns: true }))
      .on("data", async (d) => {
        if (isHabitablePlanet(d)) {
          const planet = { keplerName: d.kepler_name } as Planet;
          // console.log(planet);
          await savePlanet(planet);
        }
      })
      .on("error", (e) => {
        console.log(e);
        reject(e);
      })
      .on("end", async () => {
        const planetsFound = await getAllPlanets();
        console.log(`${planetsFound.length} habitable planets found`);
        resolve();
      });
  });
}

async function savePlanet(planet: Planet) {
  try {
    // * store (upsert) planet data to MongoDB
    await planets.updateOne(planet, planet, UPSERT);
  } catch (err) {
    console.error(`Could not save planet ${err}`);
  }
}

async function getAllPlanets() {
  return await planets.find({}, FIND_OPTION);
}

async function findPlanet(keplerName: string) {
  return await planets.findOne({ keplerName }, FIND_OPTION);
}

export { Planet };
export { loadPlanetsData, getAllPlanets, findPlanet };
