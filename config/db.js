
require("dotenv").config();
const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.DB_HOST || "reitansorg01.mysql.domeneshop.no",
  user: process.env.DB_USER || "reitansorg01",
  password: process.env.DB_PASSWORD || "Hambo-1000-Uh-Hand-Veikt",
  database: process.env.DB_NAME || "reitansorg01",
});


/* Remove connection, try only in index.js

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected");
});
*/

module.exports = db;