import connectionDB from "../database/database.js";

export async function insertNewGameValidation(req, res, next) {
  const { name, stockTotal, pricePerDay, categoryId } = req.body;

  if (!name) {
    return res.status(400).send("name não pode ser uma string vazia");
  }

  if (stockTotal < 1 || pricePerDay < 1) {
    return res.status(400).send("estoque e preço devem ser maiores que zero");
  }

  try {
    const { rows } = await connectionDB.query(
      "SELECT * FROM categories WHERE id=$1;",
      [categoryId]
    );

    if (rows.length === 0) {
      return res.status(404).send("categoria inexistente");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }

  next();
}
