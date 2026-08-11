import mongoose from "mongoose";
import { type Request, type Response } from "express";

import { showSchema } from "../schema/show.schema.js";
import { getRandomShows } from "../lib/utils.js";

const ShowModel = mongoose.model("Show", showSchema);

export const getPreviewOfGenres = async (
  req: Request,
  res: Response<GenresPreviewResponseBody>,
) => {
  try {
    const genres: GenresPreviewResponseBody = await ShowModel.aggregate([
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
    ]);

    genres.forEach((genre) => {
      if (genre.count < 100) {
        if (genre.count < 20) return;
        genre.shows = genre.shows.slice(genre.shows.length - 20);
        return;
      }

      const shows = getRandomShows(genre.shows, 20);
      genre.shows = shows;
    });

    return res.json(genres);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default getPreviewOfGenres;
