import { type Request, type Response } from "express";
import mongoose from "mongoose";

import { showSchema } from "../schema/show.schema.js";

const ShowModel = mongoose.model("Show", showSchema);

export const getMovies = async (
  req: Request<{}, unknown, unknown, MoviesRequestQuery>,
  res: Response,
) => {
  try {
    const queries = Object.entries(req.query);

    let shows = await ShowModel.find();
    if (!queries.length) return res.json(shows);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getMoviesById = async (
  req: Request<MoviesByIdRequestQueryParams>,
  res: Response<MoviesByIdResponseBody>,
) => {
  try {
    const { id } = req.params;

    const data = ShowModel.findOne({ id: parseInt(id) }) as unknown as Show;
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};
