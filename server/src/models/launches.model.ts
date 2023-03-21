import { launches } from "./launches.mongo";
import { planets } from "./planets.mongo";

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
  return await launches.find<Launch>({}, { _id: 0, __v: 0 });
}

async function getLatestFlightNumber(): Promise<number> {
  const latestLaunch = await launches.findOne<Launch>({}).sort("-flightNumber");
  if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER;
  return latestLaunch.flightNumber;
}

async function saveLaunch(launch: Launch) {
  const launchFilter = { flightNumber: launch.flightNumber };
  await launches.findOneAndUpdate(launchFilter, launch, UPSERT);
}

async function scheduleNewLaunch(data: LaunchData) {
  // * check target planet exist
  const planet = { keplerName: data.target };
  const foundPlanet = await planets.findOne(planet, { _id: 0, __v: 0 });
  if (!foundPlanet) return;

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
async function abortLaunchById(id: number) {
  // console.log(id, launches.get(id));
  // const launch = launches.get(id);
  const filter = { flightNumber: id };
  const launch = await launches.findOneAndUpdate<Launch>(filter, {
    _id: 0,
    __v: 0,
  });
  if (!launch) return;
  await launches.updateOne(filter, launch, UPSERT);
  if (!launch) return;

  launch.upcoming = false;
  launch.success = false;
  return launch;
}

export { LaunchData, Launch };
export { getAllLaunches, scheduleNewLaunch, abortLaunchById };
