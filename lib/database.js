import mysql from "mysql2/promise";
export const pool = mysql.createPool({
  connectionLimit: 500,
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "ecommerce",
  waitForConnections: true,
});
