import connectionDB from "../database/database.js";

export async function newRentalValidation(req, res, next) {
  const { customerId, gameId, daysRented } = req.body;

  try {
    const customerExists = await connectionDB.query(
      "SELECT * FROM customers WHERE id = $1;",
      [customerId]
    );

    if (customerExists.rows.length === 0) {
      return res.status(400).send("cliente não existe");
    }

    const gameExists = await connectionDB.query(
      "SELECT * FROM games WHERE id = $1;",
      [gameId]
    );

    if (gameExists.rows.length === 0) {
      return res.status(400).send("jogo não existe");
    }

    if (daysRented <= 0) {
      return res.status(400).send("dias de aluguel precisa ser > 0");
    }

    const unavailableGames = await connectionDB.query(
      `
    SELECT FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL;`,
      [gameId]
    );

    const totalStock = await connectionDB.query(
      `
    SELECT games."stockTotal" FROM games WHERE id = $1;`,
      [gameId]
    );

    const availableGames =
      totalStock.rows[0].stockTotal - unavailableGames.rows.length;

    if (availableGames === 0 || availableGames < 0) {
      return res.status(400).send("estoque esgotado para esse jogo");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }

  next();
}

export async function rentedGameValidation(req, res, next) {
  const rentalId = req.params.id;

  try {
    const rentalExists = await connectionDB.query(
      `SELECT * FROM rentals WHERE id = $1;`,
      [rentalId]
    );

    if (rentalExists.rows.length === 0) {
      return res.status(404).send("aluguel inexistente");
    }

    const closedRental = await connectionDB.query(
      `SELECT "returnDate" FROM rentals WHERE id = $1;`,
      [rentalId]
    );

    if (closedRental.rows[0].returnDate !== null) {
      return res.status(400).send("aluguel finalizado");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }

  next();
}
