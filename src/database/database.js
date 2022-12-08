import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";

const { Pool } = pkg;

/*
const connection = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: DATABASE_PASSWORD,
  database: "boardcamp"
});
*/

const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default connection;
