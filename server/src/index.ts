import http from "http";

import app from "./app";
import { loadPlanetsData } from "./models/planets.model";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

async function startServer() {
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

startServer();

process.on("uncaughtException", (err) => {
  console.error("Process uncaught exception", err);
});
