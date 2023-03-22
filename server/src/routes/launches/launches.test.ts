import { describe } from "node:test";
const request = require("supertest");

import app from "../../app";
import { mongoConnect, mongoDisconnect } from "../../services/mongo";

const getLaunches = () => {
  test("It should respond with 200 success", async () => {
    await request(app)
      .get("/launches")
      .expect("content-type", /json/)
      .expect(200);
  });
};

const postLaunches = () => {
  test("It should respond with 201 created", async () => {
    const reqBody = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-1410 b",
      launchDate: "January 4, 2028",
    };
    const res = await request(app)
      .post("/launches")
      .send(reqBody)
      .expect("content-type", /json/)
      .expect(201);

    const reqDate = new Date(reqBody.launchDate).valueOf();
    const resDate = new Date(res.body.launchDate).valueOf();
    expect(resDate).toBe(reqDate);

    const expectResBody = {
      ...reqBody,
      launchDate: new Date(reqBody.launchDate).toISOString(),
    };
    expect(res.body).toMatchObject(expectResBody);
  });
  test("It should catch mission required properties", async () => {
    const reqBody = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-1410 b",
    };
    const errMsg = { error: "Missing required launch property" };
    const res = await request(app)
      .post("/launches")
      .send(reqBody)
      .expect("content-type", /json/)
      .expect(400);
    expect(res.body).toMatchObject(errMsg);
  });
  test("It should catch invalid dates", async () => {
    const reqBody = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-1410 b",
      launchDate: "Whatever 4, 2028",
    };
    const errMsg = { error: "Invalid launch date" };
    const res = await request(app)
      .post("/launches")
      .send(reqBody)
      .expect("content-type", /json/)
      .expect(400);
    expect(res.body).toMatchObject(errMsg);
  });
};

describe("Launches API", () => {
  beforeAll(async () => await mongoConnect());
  describe("Test GET /launches", getLaunches);
  describe("Test POST /launches", postLaunches);
  afterAll(async () => await mongoDisconnect());
});
