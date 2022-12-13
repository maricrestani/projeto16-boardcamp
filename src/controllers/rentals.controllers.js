import dayjs from "dayjs";
import connectionDB from "../database/database.js";

export async function returnRentals(req, res) {
  const { customerId, gameId } = req.query;
  let rentalsReturned = [];

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

    if (!customerId && !gameId) {
      const allRentals = await connectionDB.query(
        `SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName",games."categoryId", categories.name AS "categoryName" FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id`
      );
      mapear(allRentals);
    }

    function mapear(array) {
      rentalsReturned = array.rows.map((m) => ({
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
    }
    res.send(rentalsReturned);
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
  const rentalId = req.params.id;
  const returnDate = dayjs().format("YYYY-MM-DD");

  try {
    const rentDate = await connectionDB.query(
      `SELECT rentals."rentDate"::text FROM rentals WHERE id=$1;`,
      [rentalId]
    );

    const daysRented = await connectionDB.query(
      `SELECT rentals."daysRented" FROM rentals WHERE id=$1;`,
      [rentalId]
    );

    const originalPrice = await connectionDB.query(
      `SELECT rentals."originalPrice" FROM rentals WHERE id=$1;`,
      [rentalId]
    );

    const pricePerDay =
      originalPrice.rows[0].originalPrice / daysRented.rows[0].daysRented;

    const diff = dayjs(rentDate.rows[0].rentDate).diff(returnDate, "day");

    if (diff >= 0) {
      const delayedDays = diff - daysRented.rows[0].daysRented;

      if (delayedDays <= 0) {
        connectionDB.query(
          `UPDATE rentals SET "returnDate"=$1, 
        "delayFee"=$2 WHERE id = $3`,
          [returnDate, delayedDays * pricePerDay, rentalId]
        );
      }
      res.sendStatus(200);
    } else {
      connectionDB.query(
        `UPDATE rentals SET "returnDate"=$1, 
        "delayFee"=$2 WHERE id = $3`,
        [returnDate, 0, rentalId]
      );
      res.sendStatus(200);
    }
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
