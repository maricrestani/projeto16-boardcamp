import dayjs from "dayjs";
import connectionDB from "../database/database.js";

export async function returnRentals(req, res) {
  const customerId = req.query.customerId;
  const gameId = req.query.gameId;

  try {
    if (customerId) {
      const filteredBycustomerId = await connectionDB.query(
        `SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName",games."categoryId", categories.name AS "categoryName" FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id WHERE rentals."customerId" = $1;`,
        [customerId]
      );

      mapear(filteredBycustomerId);
    }

    if (gameId) {
      const filteredByGameId = await connectionDB.query(
        `SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName",games."categoryId", categories.name AS "categoryName" FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id WHERE rentals."gameId" = $1;`,
        [gameId]
      );
      mapear(filteredByGameId);
    }

    const allRentals = await connectionDB.query(
      `SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName",games."categoryId", categories.name AS "categoryName" FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id`
    );
    mapear(allRentals);

    function mapear(array) {
      let rentalsReturned = array.rows.map((m) => ({
        id: m.id,
        customerId: m.customerId,
        gameId: m.gameId,
        rentDate: m.rentDate,
        daysRented: m.daysRented,
        returnDate: m.returnDate,
        originalPrice: m.originalPrice,
        delayFee: m.delayFee,
        customer: {
          id: m.customerId,
          name: m.customerName,
        },
        game: {
          id: m.gameId,
          name: m.gameName,
          categoryId: m.categoryId,
          categoryName: m.categoryName,
        },
      }));

      return res.send(rentalsReturned);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function insertNewRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  let pricePerDay = 0;

  try {
    pricePerDay = await connectionDB.query(
      `SELECT "pricePerDay" FROM games WHERE id=$1;`,
      [gameId]
    );

    const rentDate = dayjs().format("YYYY-MM-DD");
    const originalPrice = daysRented * pricePerDay.rows[0].pricePerDay;

    await connectionDB.query(
      `INSERT INTO rentals
  ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
  VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [customerId, gameId, rentDate, daysRented, null, originalPrice, null]
    );

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function returnRentedGame(req, res) {
  const returnDate = dayjs().format("YYYY-MM-DD");
  const delayFee = 0;

  try {
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function deleteRental(req, res) {
  const rentalId = req.params.id;

  try {
    await connectionDB.query(`DELETE FROM rentals WHERE id=$1;`, [rentalId]);

    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
