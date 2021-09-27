const PORT = 3000;
const express = require("express");

const { mongoConnect } = require("./utils/database");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

// telling express what engine to use to render our contents
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  User.findById("614f826915985b0d7971e0e6")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      console.log(user);
      next();
    })
    .catch((err) => console.log(err));
});
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

mongoConnect(() => {
  app.listen(PORT, () => {
    console.log(`Your server is running on port ${PORT}`);
  });
});
