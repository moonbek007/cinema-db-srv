import { createClient } from "redis";

import { redisConfig } from "../constants/constants.js";

export const redisClient = createClient(redisConfig);

redisClient.on("connect", () =>
  console.log("Successfully connected to Redis Cloud!"),
);
redisClient.on("error", (err) => console.log("Redis Client Error", err));
