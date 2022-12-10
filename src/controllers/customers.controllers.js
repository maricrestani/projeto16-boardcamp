import dayjs from "dayjs";
import connectionDB from "../database/database.js";

export async function insertNewCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;

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
