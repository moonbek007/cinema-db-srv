import mongoose from "mongoose";
import { type Request, type Response } from "express";

import { collectionSchema } from "../schema/collection.schema.js";
import { DB_MODELS, DB_NAMES } from "../constants/constants.js";

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
    const genres: CollectionsResponseBody = await CollectionModel.find();
    return res.json(genres);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};
