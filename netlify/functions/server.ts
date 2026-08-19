import path from "path";
import fs from "fs";
import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import mongoose from "mongoose";
import serverless from "serverless-http";

import moviesRouter from "../../src/routes/movies.js";
import collectionsRouter from "../../src/routes/collections.js";
import genresRouter from "../../src/routes/genres.js";

import { redisClient } from "../../src/services/redisClient.service.js";
import { BaseEndpoints, mongoDbURI } from "../../src/constants/constants.js";

const app: Express = express();

let isConnected = false;
let redisConnected = false;

async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  if (!mongoDbURI) {
    throw new Error("MONGODB_URI environment variable is missing");
  }

  try {
    await mongoose.connect(mongoDbURI);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

async function connectToRedis() {
  if (redisConnected) {
    return;
  }

  try {
    await redisClient.connect();
    redisConnected = true;
  } catch (error) {
    console.error("Redis connection error:", error);
    throw error;
  }
}

app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectToDatabase();
    await connectToRedis();
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.use(cors());

app.use(BaseEndpoints.MOVIES, moviesRouter);

app.use(BaseEndpoints.COLLECTIONS, collectionsRouter);

app.use(BaseEndpoints.GENRES, genresRouter);

const swaggerYaml = fs.readFileSync(
  path.join(process.cwd(), "swagger.yaml"),
  "utf8",
);
const swaggerHtml = fs.readFileSync(
  path.join(process.cwd(), "index.html"),
  "utf8",
);

app.get("/swagger.yaml", (req, res) => {
  res.status(200).type("text/yaml").send(swaggerYaml);
});
app.get("/", (req, res) => {
  res.status(200).type("html").send(swaggerHtml);
});

app.use((req: Request, res: Response<{ message: string }>) => {
  res.status(404).json({ message: "No matching routes found!" });
});

export const handler = serverless(app);
