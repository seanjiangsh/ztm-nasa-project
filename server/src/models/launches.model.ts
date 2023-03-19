// import { launches } from "./launches.mongo";

type NewLaunch = {
  mission: string;
  rocket: string;
  launchDate: Date;
  target: string;
};
type Launch = NewLaunch & {
  flightNumber: number;
  customers: Array<string>;
  upcoming: boolean;
  success: boolean;
};

let latestFlightNumber = 100;

const launch: Launch = {
  flightNumber: latestFlightNumber,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS2",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

const launches = new Map<number, Launch>();
launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(newLaunch: NewLaunch) {
  latestFlightNumber++;
  const launch: Launch = {
    ...newLaunch,
    flightNumber: latestFlightNumber,
    customers: ["ztm", "nasa"],
    upcoming: true,
    success: true,
  };
  launches.set(latestFlightNumber, launch);
}

// * mark launch as aborted
function abortLaunchById(id: number) {
  // console.log(id, launches.get(id));
  const launch = launches.get(id);
  if (!launch) return;

  launch.upcoming = false;
  launch.success = false;
  return launch;
}

export { NewLaunch, Launch };
export { getAllLaunches, addNewLaunch, abortLaunchById };
