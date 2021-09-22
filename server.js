const PORT = 3000;
const express = require("express");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const errorController = require("./controllers/error");
const sequelize = require("./utils/database");

const app = express();

// telling express what engine to use to render our contents
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

// I'm craeting relations btwn tables
// product should belong to user || user has many products
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
// assocciation for the carts
// User should have one cart || cart belong to the user
User.hasOne(Cart);
Cart.belongsTo(User);

// one cart can hold multiple products
Cart.belongsToMany(Product, { through: CartItem });
// one product can belong to many carts
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);

// each order has many products
// Product.belongsToMany(Order, { through: OrderItem });
Order.belongsToMany(Product, { through: OrderItem });

// sync is going to sync all tables with the models and create them if not
sequelize
  .sync()
  .then(() => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Kareem", email: "kareemfouad27@gmail.com" });
    }
    return user;
  })
  .then((user) => {
    user.createCart();
  })
  .then((cart) => {
    app.listen(PORT, () => {
      console.log(`Your server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
