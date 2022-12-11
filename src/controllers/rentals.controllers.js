import dayjs from "dayjs";
import connectionDB from "../database/database.js";

export async function returnRentals(req, res) {
  const customerId = req.query.customerId;
  const gameId = req.query.gameId;

  try {
    if (customerId) {
      const filteredBycustomerId = await connectionDB.query(
        `SELECT * FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id WHERE rentals."customerId" = $1;`,
        [customerId]
      );
      return res.send(filteredBycustomerId.rows);
    }

    if (gameId) {
      const filteredBygameId = await connectionDB.query(
        `SELECT * FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id WHERE rentals."gameId" = $1;`,
        [gameId]
      );
      return res.send(filteredBygameId.rows);
    }

    const { rows } =
      await connectionDB.query(`SELECT * FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id
`);

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
       await connectionDB.query(`SELECT * FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id
   


const receitasCategorias = await connection.query(`
      SELECT receitas.titulo AS "receita", categorias.nome AS "categoria" 
        FROM receitas
          JOIN categorias_receitas
            ON receitas.id = categorias_receitas.id_receita
          JOIN categorias
            ON categorias_receitas.id_categoria = categorias.id
          WHERE receitas.id = $1;
    `, [id]);


 `SELECT * FROM rentals JOIN customers ON rentals.customerId = customers.id JOIN games ON rentals.gameId = games.id
 
 games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId"=categories.id WHERE games.name ILIKE $1 ;`,

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

/*

[
  {
    id: 1,
    customerId: 1,
    gameId: 1,
    rentDate: '2021-06-20',
    daysRented: 3,
    returnDate: null, // troca pra uma data quando já devolvido
    originalPrice: 4500,
    delayFee: null,

    customer: {
     id: 1,
     name: 'João Alfredo'
    },
    game: {
      id: 1,
      name: 'Banco Imobiliário',
      categoryId: 1,
      categoryName: 'Estratégia'
    }
  }
]


{
    "id": 1,
    "customerId": 1,
    "gameId": 1,
    "rentDate": "2022-12-11T03:00:00.000Z",
    "daysRented": 3,
    "returnDate": null,
    "originalPrice": 4500,
    "delayFee": null
  },
*/
