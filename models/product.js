const fs = require("fs");
const path = require("path");

const Cart = require("./cart");

const rootDir = require("../utils/path");
const p = path.join(rootDir, "data", "products.json");

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      return cb([]);
    }
    cb(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(id, title, price, description, imgUrl) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.description = description;
    this.imgUrl = imgUrl;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const exisitingProductIndex = products.findIndex(
          (p) => p.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[exisitingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.floor(Math.random() * 100).toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  static delete(id) {
    getProductsFromFile((products) => {
      const product = products.find((product) => product.id === id);
      const updatedProducts = products.filter((product) => product.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        console.log(err);
        if (!err) {
          Cart.delete(id, product.price);
        }
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findProductById(id, cb) {
    getProductsFromFile((products) => {
      const foundProduct = products.find((product) => product.id === id);
      cb(foundProduct);
    });
  }
};
