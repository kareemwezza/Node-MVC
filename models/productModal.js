// normal modal build with mysql2 only

const db = require("../utils/mysqldb");

module.exports = class Product {
  constructor(id, title, price, description, imageUrl) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  save() {
    // values here adding extra secuirity line to avoid sql injection
    return db.execute(
      "INSERT INTO products (title, price, imageUrl, description) VALUES(?,?,?,?)",
      [this.title, this.price, this.imageUrl, this.description]
    );
  }

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
  }
};
