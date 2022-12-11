import { Router } from "express";
import {
  insertNewRental,
  returnRentals,
} from "../controllers/rentals.controllers.js";
import { newRentalValidation } from "../middlewares/rentals.middlewares.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", returnRentals);
rentalsRouter.post("/rentals", newRentalValidation, insertNewRental);
rentalsRouter.post("/rentals/:id/return");
rentalsRouter.delete("/rentals/:id");

export default rentalsRouter;
