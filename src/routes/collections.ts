import { Router } from "express";

import { getCollections } from "../controllers/collections.controller.js";
import { CollectionsEndpoints } from "../constants/constants.js";

const collectionsRouter = Router();

collectionsRouter.get(CollectionsEndpoints.BASE, getCollections);

export default collectionsRouter;
