import dayjs from "dayjs";
import connectionDB from "../database/database.js";

export async function returnRentals(req, res) {
  try {
    const { rows } = await connectionDB.query("SELECT * FROM rentals;");
    res.send(rows);
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
  } catch (err) {
    res.status(500).send(err.message);
  }

  const rentDate = dayjs().format("YYYY-MM-DD");
  const originalPrice = daysRented * pricePerDay.rows[0].pricePerDay;

  // Ao inserir um aluguel, os campos returnDate e delayFee devem sempre começar como null

  await connectionDB.query(
    `INSERT INTO rentals
  ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
  VALUES ($1, $2, $3, $4, $5, $6, $7);`,
    [customerId, gameId, rentDate, daysRented, null, originalPrice, null]
  );

  res.sendStatus(201);
}



/*
 `SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId"=categories.id WHERE games.name ILIKE $1 ;`,

`SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId"=categories.id WHERE games.name ILIKE $1 ;`,


//customers:
customers.id AS customerId

customer: {
     id
     name
    }

//games:
games.id AS gameId
game: {
      id
      name
      categoryId
      categories.name AS "categoryName"
    }

//rentals:
rentDate
daysRented
retunrDate

originalPrice
delayFee
*/
