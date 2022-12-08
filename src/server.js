import express from "express";
import cors from "cors";
import connection from "./database/database.js";

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
