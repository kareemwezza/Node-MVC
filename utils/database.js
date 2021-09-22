const Sequelize = require("sequelize");

// this will creqte db pool connection managed by sequelize
const sequelize = new Sequelize("node-complete", "root", "10203040a", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
