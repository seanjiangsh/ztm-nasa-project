import http from "http";

import app from "./app";
import { loadPlanetsData } from "./models/planets.model";
import { loadLaunchesData } from "./models/launches.model";
import { mongoConnect } from "./services/mongo";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchesData();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

startServer();

process.on("uncaughtException", (err) => {
  console.error("Process uncaught exception", err);
});
