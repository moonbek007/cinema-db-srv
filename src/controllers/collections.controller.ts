import mongoose from "mongoose";
import { type Request, type Response } from "express";

import { showSchema } from "../schema/show.schema.js";

const ShowModel = mongoose.model("Show", showSchema);

export const getCollections = async (
  req: Request,
  res: Response<CollectionsResponseBody>,
) => {
  try {
    const genres = await ShowModel.aggregate([
      { $unwind: "$genres" },
      {
        $group: {
          _id: "$genres",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: 1,
        },
      },
    ]);
    return res.json(genres);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};
