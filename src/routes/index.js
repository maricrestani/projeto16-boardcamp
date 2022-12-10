import { Router } from "express";
import categoriesRouter from "./categories.routes.js";
import gamesRouter from "./games.routes.js";

const route = Router();

route.use(categoriesRouter);
route.use(gamesRouter);


export default route;
