import { createClient } from "redis";

import { redisConfig } from "../constants/constants.js";

export const redisClient = createClient(redisConfig);

redisClient.on("connect", () => console.log("Connected to Redis"));
redisClient.on("error", (err) => console.log("Redis Client Error", err));
