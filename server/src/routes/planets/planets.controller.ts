import { Request, Response } from "express";

import { getAllPlanets } from "../../models/planets.model";

async function httpGetAllPlanets(req: Request, res: Response) {
  return res.json(await getAllPlanets());
}

export { httpGetAllPlanets };
