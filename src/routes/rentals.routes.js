import { Router } from "express";
import {
  deleteRental,
  insertNewRental,
  returnRentals,
  returnRentedGame,
} from "../controllers/rentals.controllers.js";
import {
  newRentalValidation,
  rentedGameValidation,
  returnGameValidation,
} from "../middlewares/rentals.middlewares.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", returnRentals);
rentalsRouter.post("/rentals", newRentalValidation, insertNewRental);
rentalsRouter.post(
  "/rentals/:id/return",
  returnGameValidation,
  returnRentedGame
);
rentalsRouter.delete("/rentals/:id", rentedGameValidation, deleteRental);

export default rentalsRouter;
