import { type Request, type Response } from "express";
import mongoose from "mongoose";

import { showSchema } from "../schema/show.schema.js";
import {
  CountryQueryValues,
  DB_MODELS,
  MoviesQueryParams,
} from "../constants/constants.js";

const ShowModel = mongoose.model(DB_MODELS.SHOW, showSchema);

export const getMovies = async (
  req: Request<{}, unknown, unknown, MoviesRequestQuery>,
  res: Response<MoviesResponseBody>,
) => {
  try {
    const queries = Object.entries(req.query) as unknown as [
      MoviesQueryParams,
      string,
    ];

    const queryObject: MoviesQueryObject = {};

    queries.forEach(([queryName, queryValue]) => {
      const queryFilters = queryValue.split("&");
      switch (queryName) {
        case MoviesQueryParams.SEARCH:
          break;
        case MoviesQueryParams.RATING:
          queryObject["rating.average"] = {
            $gt: parseInt(queryValue),
            $lt: parseInt(queryValue) + 1,
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

    const pageNumber = req.query.Page ? parseInt(req.query.Page) : 1;

    const [showsAfterAggregate]: MoviesAggregatedType =
      await ShowModel.aggregate([
        // Apply your exact filter object using $match
        { $match: queryObject },
        // Split into Count and Pagination Data
        {
          $facet: {
            totalCount: [{ $count: "count" }],
            shows: [
              { $skip: (pageNumber - 1) * 20 }, // Changing pages
              { $limit: 20 }, // Number of elements per page
            ],
          },
        },
      ]);

    console.log(`Number of shows found:`, showsAfterAggregate.shows.length);
    return res.json({
      count: showsAfterAggregate.totalCount[0].count,
      shows: showsAfterAggregate.shows,
    });
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

export const getMoviesByName = async (
  req: Request<{}, unknown, unknown, MoviesByNameRequestQuery>,
  res: Response<MoviesByNameResponseBody>,
) => {
  try {
    const { name: searchName } = req.query;
    const shows = await ShowModel.aggregate([
      {
        $match: {
          name: {
            $regex: searchName,
            $options: "i",
          },
        },
      },
    ]);
    return res.json(shows);
  } catch (error) {
    return res.status(500).json({ error: "No 'name' query param provided." });
  }
};
