import joi from "joi";
import connectionDB from "../database/database.js";

export async function createCategoryValidation(req, res, next) {
  const { name } = req.body;

  if (!name) {
    res.status(400).send("name não pode ser uma string vazia");
  }

  try {
    const { rows } = await connectionDB.query(
      "SELECT * FROM categories WHERE name = $1;",
      [name]
    );

    if (rows.length !== 0) {
      res.status(409).send("name já existe");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }

  next();
}
