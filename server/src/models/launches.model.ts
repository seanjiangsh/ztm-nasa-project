import fs from "fs";

import { launches } from "./launches.mongo";

type LaunchData = {
  mission: string;
  rocket: string;
  launchDate: Date;
  target: string;
};
type Launch = LaunchData & {
  flightNumber: number;
  customers: Array<string>;
  upcoming: boolean;
  success: boolean;
};

const UPSERT = { upsert: true };
const FIND_OPTION = { _id: 0, __v: 0 }; // * remove MongoDB buildin property
const DEFAULT_FLIGHT_NUMBER = 100;

// const launch: Launch = {
//   flightNumber: 100,
//   mission: "Kepler Exploration X",
//   rocket: "Explorer IS2",
//   launchDate: new Date("December 27, 2030"),
//   target: "Kepler-442 b",
//   customers: ["ZTM", "NASA"],
//   upcoming: true,
//   success: true,
// };
// saveLaunch(launch);

async function getAllLaunches() {
  return await launches.find<Launch>({}, FIND_OPTION);
}

async function getLatestFlightNumber(): Promise<number> {
  const latestLaunch = await launches.findOne<Launch>({}).sort("-flightNumber");
  if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER;
  return latestLaunch.flightNumber;
}

type FindLaunchFilter = { flightNumber: number } & any;
async function findLaunch(filter: FindLaunchFilter) {
  return await launches.findOne(filter);
}

async function saveLaunch(launch: Launch) {
  const launchFilter = { flightNumber: launch.flightNumber };
  await launches.findOneAndUpdate(launchFilter, launch, UPSERT);
}

async function scheduleNewLaunch(data: LaunchData) {
  // * save new launch data to MongoDB
  const latestFlightNumber = (await getLatestFlightNumber()) + 1;
  const launch: Launch = {
    ...data,
    flightNumber: latestFlightNumber,
    customers: ["ztm", "nasa"],
    upcoming: true,
    success: true,
  };
  try {
    await saveLaunch(launch);
    return launch;
  } catch (err) {
    console.error(`Save launch error: ${err}`);
  }
}

// * mark launch as aborted
async function abortLaunchById(flightNumber: number) {
  const filter = { flightNumber };
  const update = { upcoming: false, success: false };
  const result = await launches.updateOne<Launch>(filter, update);
  return result.modifiedCount === 1;
}

// ! v2
type SpaceXLaunch = {
  flight_number: number;
  name: string;
  rocket: { name: string };
  date_local: string;
  payloads: Array<{ customers: Array<string> }>;
  upcoming: boolean;
  success: boolean;
};
type SpaceXResponseData = {
  docs: Array<SpaceXLaunch>;
  totalPages: number;
  page: number;
  nextPage: number;
};

// * load launches from SpaceX API
// https://github.com/r-spacex/SpaceX-API
async function loadLaunchesData() {
  const findLaunchFilter = {
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  };
  const firstLaunchInMongo = await findLaunch(findLaunchFilter);

  if (firstLaunchInMongo) {
    console.log("Launch data already loaded");
  } else {
    const launches = await getSpaceXLaunches();
    launches.forEach(saveLaunch);
    console.log("New SpaceX launches loaded");
  }
}

async function getSpaceXLaunches() {
  const url = "https://api.spacexdata.com/v5/launches/query";
  const body = {
    query: {},
    options: {
      pagination: false,
      populate: [
        { path: "rocket", select: { name: 1 } },
        { path: "payloads", select: { customers: 1 } },
      ],
    },
  };
  const init: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  const response = await fetch(url, init);
  if (response.status !== 200) {
    console.error("Problem downloading launch data");
    throw new Error("Launch data download failed");
  }

  const resJson: SpaceXResponseData = await response.json();
  const xLaunches = resJson.docs;
  const launches: Array<Launch> = [];
  for (const xLaunch of xLaunches) {
    const {
      flight_number,
      name,
      rocket,
      date_local,
      payloads,
      upcoming,
      success,
    } = xLaunch;
    const customers = payloads.flatMap((p) => p.customers);
    const launch: Launch = {
      flightNumber: flight_number,
      mission: name,
      rocket: rocket.name,
      target: "N/A",
      launchDate: new Date(date_local),
      customers,
      upcoming,
      success,
    };
    launches.push(launch);
  }
  // fs.writeFileSync("../SpaceX.json", JSON.stringify(launches), "utf-8");
  return launches;
}

export { LaunchData, Launch };
export {
  getAllLaunches,
  findLaunch,
  scheduleNewLaunch,
  abortLaunchById,
  loadLaunchesData,
};
