import express from "express";

import {
  httpAbortLaunch,
  httpGetAllLaunches,
  httpPostNewLaunches,
} from "./launches.controller";

const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpPostNewLaunches);
launchesRouter.delete("/:id", httpAbortLaunch);

export default launchesRouter;
