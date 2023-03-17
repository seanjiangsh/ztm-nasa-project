import { Request, Response } from "express";

import {
  getAllLaunches,
  addNewLaunch,
  NewLaunch,
  abortLaunchById,
} from "../../models/launches.model";

async function httpGetAllLaunches(req: Request, res: Response) {
  return res.json(getAllLaunches());
}

async function httpPostNewLaunches(req: Request, res: Response) {
  const newLaunch = req.body as NewLaunch;
  const { mission, rocket, launchDate, target } = newLaunch;

  if (!mission || !rocket || !launchDate || !target)
    return res.status(400).json({ error: "Missing required launch property" });

  newLaunch.launchDate = new Date(launchDate);
  if (isNaN(newLaunch.launchDate.getTime()))
    return res.status(400).json({ error: "Invalid launch date" });

  addNewLaunch(req.body as NewLaunch);
  return res.status(201).json(newLaunch);
}

async function httpAbortLaunch(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid launch id" });

  const abortedLaunch = abortLaunchById(id);
  if (!abortedLaunch) {
    return res.status(404).json({ error: "Launch not found" });
  } else {
    return res.status(200).json(abortedLaunch);
  }
}

export { httpGetAllLaunches, httpPostNewLaunches, httpAbortLaunch };
