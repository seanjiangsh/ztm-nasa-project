import { Request, Response } from "express";

import {
  getAllLaunches,
  scheduleNewLaunch,
  LaunchData,
  abortLaunchById,
  findLaunch,
} from "../../models/launches.model";
import { findPlanet } from "../../models/planets.model";

async function httpGetAllLaunches(req: Request, res: Response) {
  return res.json(await getAllLaunches());
}

async function httpPostNewLaunches(req: Request, res: Response) {
  const launchData = req.body as LaunchData;
  const { mission, rocket, launchDate, target } = launchData;

  if (!mission || !rocket || !launchDate || !target)
    return res.status(400).json({ error: "Missing required launch property" });

  launchData.launchDate = new Date(launchDate);
  if (isNaN(launchData.launchDate.getTime()))
    return res.status(400).json({ error: "Invalid launch date" });

  // * check target planet exist
  const foundPlanet = await findPlanet(target);
  if (!foundPlanet)
    return res.status(404).json({ error: "Target planet not found" });

  const newLaunch = await scheduleNewLaunch(launchData);
  if (newLaunch) return res.status(201).json(newLaunch);
  else return res.status(500).json({ error: "Failed to schedule new launch" });
}

async function httpAbortLaunch(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid launch id" });

  if (!(await findLaunch({ flightNumber: id, upcoming: true })))
    return res.status(404).json({ error: "Launch not found or aborted" });

  const result = await abortLaunchById(id);
  if (result) return res.status(200).send();
  else return res.status(500).json({ error: "Failed to abort launch" });
}

export { httpGetAllLaunches, httpPostNewLaunches, httpAbortLaunch };
