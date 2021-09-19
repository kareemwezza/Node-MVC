const PORT = 3000;
const express = require("express");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const errorController = require("./controllers/error");

const app = express();

// telling express what engine to use to render our contents
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

app.listen(PORT, () => {
  console.log(`Your server is running on port ${PORT}`);
});
