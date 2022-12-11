import connectionDB from "../database/database.js";

export async function newRentalValidation(req, res, next) {
  const { customerId, gameId, daysRented } = req.body;

  try {
    const customerExists = await connectionDB.query(
      "SELECT * FROM customers WHERE id = $1;",
      [customerId]
    );

    console.log("passa aqui?", customerExists.rows);

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

    //- Ao inserir um aluguel, deve-se validar que existem jogos disponíveis,
    //ou seja, que não tem alugueis em aberto acima da quantidade de jogos em estoque.
    //Caso contrário, deve retornar **status 400**
  } catch (err) {
    res.status(500).send(err.message);
  }

  next();
}
