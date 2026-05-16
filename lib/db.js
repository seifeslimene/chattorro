import mysql from "mysql";

function poolConfig() {
  return {
    host: process.env.MYSQL_HOST?.trim() || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT?.trim() || "3306"),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  };
}

const pool = mysql.createPool(poolConfig());

export default function executeQuery({ query, values = [] }) {
  return new Promise((resolve, reject) => {
    pool.query(query, values, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}
