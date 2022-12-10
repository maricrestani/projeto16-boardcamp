import connectionDB from "../database/database.js";

export async function insertNewGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  try {
    const { rows } = await connectionDB.query(
      "SELECT * FROM games WHERE name = $1;",
      [name]
    );

    if (rows.length !== 0) {
      return res.status(409).send("jogo já cadastrado");
    }

    await connectionDB.query(
      `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);`,
      [name, image, stockTotal, categoryId, pricePerDay]
    );

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function returnGames(req, res) {
  const { name } = req.params;

  //FALTAM OS FILTROS DE ACORDO COM A QUERY STRING DA REQ

  try {
    const { rows } = await connectionDB.query("SELECT * FROM games;");
    res.send(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
