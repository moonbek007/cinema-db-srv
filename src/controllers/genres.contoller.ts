import mongoose from "mongoose";
import { type Request, type Response } from "express";

import { showSchema } from "../schema/show.schema.js";
import { redisClient } from "../services/redisClient.service.js";

import { BaseEndpoints, DB_MODELS, DB_NAMES } from "../constants/constants.js";

const TrendingShowModel = mongoose.model(
  DB_MODELS.SHOW,
  showSchema,
  DB_NAMES.TRENDING_SHOWS,
);

export const getPreviewOfGenres = async (
  req: Request,
  res: Response<GenresPreviewResponseBody>,
) => {
  try {
    const cachedData = await redisClient.get(BaseEndpoints.GENRES);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const genres: GenresPreviewResponseBody = await TrendingShowModel.aggregate(
      [
        {
          $unwind: "$genres",
        },
        {
          $group: {
            _id: "$genres",
            count: { $sum: 1 },
            shows: { $push: "$$ROOT" },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id",
            count: 1,
            shows: 1,
          },
        },
      ],
    );

    await redisClient.setEx(BaseEndpoints.GENRES, 3600, JSON.stringify(genres));

    return res.json(genres);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default getPreviewOfGenres;
