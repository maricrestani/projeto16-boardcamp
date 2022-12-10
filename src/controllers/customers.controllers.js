import connectionDB from "../database/database.js";
import pg from "pg";

export async function insertNewCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  pg.types.setTypeParser(1082, function (birthday) {
    return birthday;
  });

  try {
    await connectionDB.query(
      `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`,
      [name, phone, cpf, birthday]
    );
  } catch (err) {
    res.status(500).send(err.message);
  }

  res.sendStatus(201);
}

export async function returnCustomers(req, res) {
  try {
    const { rows } = await connectionDB.query("SELECT * FROM customers;");
    res.send(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function returnCustomerById(req, res) {
  const { id } = req.params;

  try {
    const { rows } = await connectionDB.query(
      "SELECT * FROM customers WHERE id=$1;",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).send("não existe cliente com esse id");
    }

    res.send(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
