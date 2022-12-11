import connectionDB from "../database/database.js";
import { newCustomerSchema } from "../models/customers.models.js";

export async function newCustomerValidation(req, res, next) {
  const { cpf } = req.body;

  const validation = newCustomerSchema.validate(req.body, {
    abortEarly: false,
  });
  if (validation.error) {
    const errors = validation.error.details.map((d) => d.message);
    res.status(400).send(errors);
    return;
  }

  try {
    const customer = await connectionDB.query(
      "SELECT * FROM customers WHERE cpf = $1;",
      [cpf]
    );

    if (customer.rows.length !== 0) {
      return res.status(409).send("cliente já existente");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }

  next();
}

export async function updateCustomerValidation(req, res, next) {
  const { cpf } = req.body;
  const { id } = req.params;

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
      "SELECT customers.id FROM customers WHERE cpf = $1;",
      [cpf]
    );

    if (cpfExists.rows.length !== 0) {
      if (idExists.rows[0].id != id)
        return res.status(409).send("cliente já existente");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }

  next();
}
