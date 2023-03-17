import path from "path";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import planetsRouter from "./routes/planets/planets.router";
import launchesRouter from "./routes/launches/launches.router";

const app = express();

// ! middlewares
app.use(morgan("combined"));

// * logging Method, URL and response time
// app.use(async (req, res, next) => {
//   const start = Date.now();
//   next();
//   const delta = Date.now() - start;
//   const logMsg = `${req.method}, ${req.baseUrl}${req.url}, ${res.statusCode}, ${delta}ms`;
//   console.log(logMsg);
// });
// * register JSON parser
app.use(express.json());
// * set CORS allow on localhost
app.use(cors({ origin: "http://localhost:3000" }));

// ! endpoints
app.use(planetsRouter);
app.use("/launches", launchesRouter);

// * serve public files on root
const publicDir = path.resolve("public");
app.use(express.static(publicDir));
app.get("/*", (req, res) => {
  const index = `${publicDir}/index.html`;
  res.sendFile(index);
});

export default app;