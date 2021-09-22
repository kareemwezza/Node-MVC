// here we use mysql2 and entering SQL queries manually to be executed

const mysql = require("mysql2");

// creating pool make it easy to keep connections alive to db
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-complete",
  password: "10203040a",
});

module.exports = pool.promise();
