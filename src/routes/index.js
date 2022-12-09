import { Router } from "express";
import categoriesRouter from "./categories.routes.js";

const route = Router();

route.use(categoriesRouter);

export default route;
