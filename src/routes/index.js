import { Router } from "express";
import categoriesRouter from "./categories.routes.js";
import customersRouter from "./customers.routes.js";
import gamesRouter from "./games.routes.js";
import rentalsRouter from "./rentals.routes.js";

const route = Router();

route.use(categoriesRouter);
route.use(gamesRouter);
route.use(customersRouter)
route.use(rentalsRouter)


export default route;
