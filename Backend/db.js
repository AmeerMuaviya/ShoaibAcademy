import mysql from "mysql";

export const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database:proces.env.DB_URL
});
