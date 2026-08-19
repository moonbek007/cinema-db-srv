import path from "path";
import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import moviesRouter from "./routes/movies.js";
import collectionsRouter from "./routes/collections.js";
import genresRouter from "./routes/genres.js";

import { redisClient } from "./services/redisClient.service.js";

import { BaseEndpoints, mongoDbURI, PORT } from "./constants/constants.js";

const swaggerDocument = YAML.load(
  path.join(import.meta.dirname, "../swagger.yaml"),
);

const app: Express = express();

app.use(cors());

app.use("/", swaggerUi.serveFiles(swaggerDocument));
app.get("/", swaggerUi.setup(swaggerDocument));

app.use(BaseEndpoints.MOVIES, moviesRouter);

app.use(BaseEndpoints.COLLECTIONS, collectionsRouter);

app.use(BaseEndpoints.GENRES, genresRouter);

app.use((req: Request, res: Response<{ message: string }>) => {
  res.status(404).json({ message: "No matching routes found!" });
});

app.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}.`);

  await redisClient.connect();
  mongoose
    .connect(mongoDbURI)
    .then(() => {
      console.log("Connected to Database");
    })
    .catch((err) => console.log(err));
});

process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await redisClient.quit();
  process.exit(0);
});
