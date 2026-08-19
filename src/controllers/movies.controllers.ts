import { type Request, type Response } from "express";
import mongoose from "mongoose";

import { redisClient } from "../services/redisClient.service.js";
import { showSchema } from "../schema/show.schema.js";

import { generateMoviesCacheKey } from "../lib/utils.js";
import {
  BaseEndpoints,
  CountryQueryValues,
  DB_MODELS,
  MoviesEndpoints,
  moviesPerPage,
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

    const pageNumber = req.query.Page ? parseInt(req.query.Page) : 1;

    if (pageNumber < 1) {
      return res
        .status(400)
        .json({ message: "Page number can not be less than 1", payload: {} });
    }

    const searchValue = req.query.Search;
    if (searchValue) queryObject.name = { $regex: searchValue, $options: "i" };

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

    const cacheKey = generateMoviesCacheKey(req, BaseEndpoints.MOVIES);
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const [showsAfterAggregate]: MoviesAggregatedType =
      await ShowModel.aggregate([
        // Apply your exact filter object using $match
        { $match: queryObject },
        // Split into Count and Pagination Data
        {
          $facet: {
            totalCount: [{ $count: "count" }],
            shows: [
              { $skip: (pageNumber - 1) * moviesPerPage }, // Changing pages
              { $limit: 20 }, // Number of elements per page
            ],
          },
        },
      ]);

    const { totalCount, shows } = showsAfterAggregate;

    if (!shows.length && totalCount.length === 0) {
      await redisClient.setEx(
        cacheKey,
        180,
        JSON.stringify({
          count: 0,
          shows,
          totalPages: 1,
          page: pageNumber,
        }),
      );

      return res
        .status(200)
        .json({ count: 0, totalPages: 1, page: pageNumber, shows });
    }

    const showsCount = totalCount[0].count;

    const totalNumberOfPages = Math.floor(showsCount / moviesPerPage) + 1;

    if (pageNumber > totalNumberOfPages) {
      return res.status(400).json({
        message: "Page out of bounds",
        payload: { totalPages: totalNumberOfPages },
      });
    }

    console.log(`Number of shows found:`, showsCount);

    await redisClient.setEx(
      cacheKey,
      180,
      JSON.stringify({
        count: showsCount,
        totalPages: totalNumberOfPages,
        page: pageNumber,
        shows,
      }),
    );

    return res.status(200).json({
      count: showsCount,
      totalPages: totalNumberOfPages,
      page: pageNumber,
      shows,
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

    return res.status(200).json(data);
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

    const cacheKey = generateMoviesCacheKey(req, MoviesEndpoints.SEARCH);
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const [showsAfterAggregation] = await ShowModel.aggregate([
      {
        $match: {
          name: {
            $regex: searchName,
            $options: "i",
          },
        },
      },
      {
        $facet: {
          shows: [{ $limit: 20 }],
        },
      },
    ]);

    await redisClient.setEx(
      cacheKey,
      120,
      JSON.stringify(showsAfterAggregation.shows),
    );

    return res.status(200).json(showsAfterAggregation.shows);
  } catch (error) {
    return res.status(500).json({ error: "No 'name' query param provided." });
  }
};
