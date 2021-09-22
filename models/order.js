const sequelize = require("../utils/database");

const Sequelize = require("sequelize");

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  adress: Sequelize.STRING,
});

module.exports = Order;
