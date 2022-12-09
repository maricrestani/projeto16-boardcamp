import { Router } from "express";
import {
  createCategory,
  returnCategories,
} from "../controllers/categories.controllers.js";
import { createCategoryValidation } from "../middlewares/categories.middlewares.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", returnCategories);
categoriesRouter.post("/categories", createCategoryValidation, createCategory);

export default categoriesRouter;
