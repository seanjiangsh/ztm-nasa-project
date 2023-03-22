import { launches } from "./launches.mongo";

import { findPlanet } from "./planets.model";

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

async function scheduledLaunchWithId(launchId: number) {
  const launchFilter = { flightNumber: launchId, upcoming: true };
  return await launches.findOne(launchFilter);
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

export { LaunchData, Launch };
export {
  getAllLaunches,
  scheduledLaunchWithId,
  scheduleNewLaunch,
  abortLaunchById,
};
