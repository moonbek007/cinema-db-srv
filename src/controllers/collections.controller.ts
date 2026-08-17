import mongoose from "mongoose";
import { type Request, type Response } from "express";

import { redisClient } from "../services/redisClient.service.js";
import { collectionSchema } from "../schema/collection.schema.js";

import { BaseEndpoints, DB_MODELS, DB_NAMES } from "../constants/constants.js";

const CollectionModel = mongoose.model(
  DB_MODELS.COLLECTION,
  collectionSchema,
  DB_NAMES.COLLECTIONS_INFO,
);

export const getCollections = async (
  req: Request,
  res: Response<CollectionsResponseBody>,
) => {
  try {
    const cachedData = await redisClient.get(BaseEndpoints.COLLECTIONS);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const genres: CollectionsResponseBody = await CollectionModel.find();

    await redisClient.setEx(
      BaseEndpoints.COLLECTIONS,
      3600,
      JSON.stringify(genres),
    );
    return res.json(genres);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};
