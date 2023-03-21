import { Request, Response } from "express";

import {
  getAllLaunches,
  scheduleNewLaunch,
  LaunchData,
  abortLaunchById,
} from "../../models/launches.model";

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

  const newLaunch = await scheduleNewLaunch(launchData);
  if (newLaunch) return res.status(201).json(newLaunch);
  else return res.status(500).json({ error: "Schedule new launch failed" });
}

async function httpAbortLaunch(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid launch id" });

  const abortedLaunch = await abortLaunchById(id);
  if (!abortedLaunch) {
    return res.status(404).json({ error: "Launch not found" });
  } else {
    return res.status(200).json(abortedLaunch);
  }
}

export { httpGetAllLaunches, httpPostNewLaunches, httpAbortLaunch };
