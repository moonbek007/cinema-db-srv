import { Router } from "express";

import getPreviewOfGenres from "../controllers/genres.contoller.js";
import { GenresEndpoints } from "../constants/constants.js";

const genresRouter = Router();

genresRouter.get(GenresEndpoints.PREVIEW, getPreviewOfGenres);

export default genresRouter;
