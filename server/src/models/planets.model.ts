import fs from "fs";

import { parse } from "csv-parse";

type Planet = {
  kepler_name: string;
  koi_disposition: "CONFIRMED" | "CANDIDATE" | "FALSE POSITIVE";
  koi_insol: number;
  koi_prad: number;
};

const habitablePlanets: Array<Planet> = [];

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
      .on("data", (d) => {
        if (isHabitablePlanet(d)) habitablePlanets.push(d);
      })
      .on("error", (e) => {
        console.log(e);
        reject(e);
      })
      .on("end", () => {
        // console.log(
        //   habitablePlanets.map((d) => d.kepler_name),
        //   habitablePlanets.length
        // );
        resolve();
      });
  });
}

function getAllPlanets() {
  return habitablePlanets;
}

export { loadPlanetsData, getAllPlanets };
