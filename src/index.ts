import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import mongoose from "mongoose";

import moviesRouter from "./routes/movies.js";
import { BaseEndpoints } from "./constants/constants.js";

const app: Express = express();

const dbURI = `mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@ac-riz9jhg-shard-00-00.2daclnk.mongodb.net:27017,ac-riz9jhg-shard-00-01.2daclnk.mongodb.net:27017,ac-riz9jhg-shard-00-02.2daclnk.mongodb.net:27017/?ssl=true&replicaSet=atlas-nx5y6d-shard-0&authSource=admin&appName=Cluster0`;
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(BaseEndpoints.MOVIES, moviesRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Cinema DB Server!");
});

app.use((req: Request, res: Response<{ message: string }>) => {
  res.status(404).json({ message: "No matching routes found!" });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
  mongoose
    .connect(dbURI)
    .then(() => {
      console.log("Connected to Database");
    })
    .catch((err) => console.log(err));
});
