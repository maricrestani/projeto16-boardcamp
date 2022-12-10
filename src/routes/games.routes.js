import { Router } from "express";
import {
  insertNewGame,
  returnGames,
} from "../controllers/games.controllers.js";
import { insertNewGameValidation } from "../middlewares/games.middlewares.js";

const gamesRouter = Router();

gamesRouter.get("/games", returnGames);
gamesRouter.post("/games", insertNewGameValidation, insertNewGame);

export default gamesRouter;
