import connectionDB from "../database/database.js";
import pg from "pg";
import { newCustomerSchema } from "../models/customers.models.js";

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
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
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

export async function updateCustomer(req, res) {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;

  const validation = newCustomerSchema.validate(req.body, {
    abortEarly: false,
  });
  if (validation.error) {
    const errors = validation.error.details.map((d) => d.message);
    res.status(400).send(errors);
    return;
  }

  try {
    const cpfExists = await connectionDB.query(
      "SELECT * FROM customers WHERE cpf = $1;",
      [cpf]
    );

    const idExists = await connectionDB.query(
      "SELECT id FROM customers WHERE cpf = $1;",
      [cpf]
    );
    console.log("cpf exists", cpfExists.rows);
    //console.log("idexists", idExists);

    if (cpfExists) {
      if (idExists.rows[0].id != id)
        return res.status(409).send("cliente já existente");
    } else {
      console.log("ok");
    }

    await connectionDB.query(
      "UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5",
      [name, phone, cpf, birthday, id]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
