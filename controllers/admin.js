const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, price, description, imageUrl } = req.body;

  // SOME MAGIC WITH SEQUELIZE
  // IT ADD METHODS TO THE USER TO CREATE PRODUCTS BELONGS TO
  req.user
    .createProduct({
      title,
      price,
      imageUrl,
      description,
    })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
  // we can add userId manually here
  /* Product.create({
    title,
    price,
    imageUrl,
    description,
    userId: req.user.id,
  })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err)); */
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const productId = req.params.productId;
  // Product.findByPk(productId)
  req.user
    .getProducts({ where: { id: productId } })
    .then((products) => {
      const product = products[0];
      if (!product) {
        return res.redirect("/admin/products");
      }
      res.render("admin/edit-product", {
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, description, imageUrl } = req.body;
  Product.findByPk(productId)
    .then((product) => {
      product.title = title;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;
      return product.save();
    })
    .then((result) => {
      console.log("PRODUCT UPDATED!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        docTitle: "All Products",
        products,
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.destroy({ where: { id: productId } })
    .then(() => {
      console.log("PRODUCT DELETED!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));

  // alt approach
  /* Product.findByPk(productId).then((product) => {
    return product.destroy()
  }).then().catch() */
};
