import { Router } from "express";

import { getMovies, getMoviesById } from "../controllers/movies.controllers.js";

import { MoviesEndpoints } from "../constants/constants.js";

const moviesRouter = Router();

moviesRouter.get(MoviesEndpoints.BASE, getMovies);

moviesRouter.get(MoviesEndpoints.BY_ID, getMoviesById);

export default moviesRouter;
