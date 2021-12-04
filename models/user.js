const mongodb = require("mongodb");
const { getDb } = require("../utils/database");

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items: [], totalPrice: 20}
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  addToCart(product) {
    const db = getDb();
    let updatedCart;
    let totalPrice = this.cart.totalPrice;
    let updatedCartItems = [...this.cart.items];
    let newQuantity = 1;
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    if (cartProductIndex >= 0) {
      updatedCartItems[cartProductIndex].quantity += newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }
    totalPrice += +product.price;
    updatedCart = { items: updatedCartItems, totalPrice };
    return db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }

  removeFromCart(productId, product) {
    const db = getDb();
    let totalPrice = this.cart.totalPrice;
    let { quantity } = this.cart.items.find((i) => {
      return i.productId.toString() === productId.toString();
    });
    let updatedCartItems = this.cart.items.filter((i) => {
      return i.productId.toString() !== productId.toString();
    });
    totalPrice -= product.price * quantity;
    return db
      .collection("users")
      .updateOne(
        { _id: this._id },
        { $set: { cart: { items: updatedCartItems, totalPrice } } }
      );
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((p) => {
      return p.productId;
    });
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          const { quantity } = this.cart.items.find((i) => {
            return product._id.toString() === i.productId.toString();
          });
          return {
            ...product,
            quantity,
          };
        });
      })
      .then((cartProducts) => {
        return cartProducts;
      })
      .catch((err) => console.log(err));
  }

  addOrder() {
    const db = getDb();
    // I need to get all products with details and quantity
    return this.getCart().then((products) => {
      const order = {
        items: products,
        totalPrice: this.cart.totalPrice,
        user: {
          _id: this._id,
          username: this.name,
          email: this.email,
        },
      };
      return db
        .collection("orders")
        .insertOne(order)
        .then(() => {
          this.cart = { items: [], totalPrice: 0 };
          return db
            .collection("users")
            .updateOne({ _id: this._id }, { $set: { cart: this.cart } });
        });
    });
  }

  getOrders() {
    const db = getDb();
    return db.collection("orders").find({ "user._id": this._id }).toArray();
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: mongodb.ObjectId(userId) })
      .then((user) => user)
      .catch((err) => console.log(err));
  }
}

module.exports = User;

const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: Schema.Types.ObjectId,
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return product._id.toString() === cp.productId.toString();
  });

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex] += 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    Items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = model("user", userSchema);
