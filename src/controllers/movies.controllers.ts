import { type Request, type Response } from "express";
import mongoose from "mongoose";

import { showSchema } from "../schema/show.schema.js";
import {
  CountryQueryValues,
  MoviesQueryParams,
} from "../constants/constants.js";

const ShowModel = mongoose.model("Show", showSchema);

export const getMovies = async (
  req: Request<{}, unknown, unknown, MoviesRequestQuery>,
  res: Response,
) => {
  try {
    const queries = Object.entries(req.query) as unknown as [
      MoviesQueryParams,
      string,
    ];

    let shows: Show[] = [];

    if (!queries.length) {
      shows = await ShowModel.find();
      return res.json(shows);
    }

    const queryObject: MoviesQueryObject = {};

    queries.forEach(([queryName, queryValue]) => {
      const queryFilters = queryValue.split("&");
      switch (queryName) {
        case MoviesQueryParams.RATING:
          queryObject["rating.average"] = {
            $gt: parseInt(queryValue),
          };
          break;
        case MoviesQueryParams.GENRE:
          queryObject.genres = {
            $in: queryFilters,
          };
          break;
        case MoviesQueryParams.TYPE:
          queryObject.type = {
            $in: queryFilters,
          };
          break;
        case MoviesQueryParams.COUNTRY:
          queryFilters.forEach((countryName, index) => {
            if (countryName === CountryQueryValues.USA)
              queryFilters[index] = CountryQueryValues.USA_FULL;
            if (countryName === CountryQueryValues.UK)
              queryFilters[index] = CountryQueryValues.UK_FULL;
          });
          queryObject["network.country.name"] = {
            $in: queryFilters,
          };
          break;
        case MoviesQueryParams.STATUS:
          queryObject.status = {
            $in: queryFilters,
          };
          break;
        case MoviesQueryParams.LANGUAGE:
          queryObject.language = {
            $in: queryFilters,
          };
        default:
          break;
      }
    });
    shows = await ShowModel.find(queryObject);
    console.log(`Number of shows found:`, shows.length);
    return res.json(shows);
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

    const data = (await ShowModel.findOne({
      id: parseInt(id),
    })) as unknown as Show;

    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};
