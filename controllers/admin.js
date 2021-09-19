const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, price, description, imgUrl } = req.body;
  const product = new Product(null, title, price, description, imgUrl);
  product.save();
  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const productId = req.params.productId;
  Product.findProductById(productId, (product) => {
    if (!product) {
      res.redirect("/");
    }
    res.render("admin/edit-product", {
      docTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, description, imgUrl } = req.body;
  const updatedProduct = new Product(
    productId,
    title,
    price,
    description,
    imgUrl
  );
  updatedProduct.save();
  res.redirect("/admin/products");
};

exports.getProducts = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render("admin/products", {
      docTitle: "All Products",
      products,
      path: "/admin/products",
    });
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.delete(productId);
  res.redirect("/admin/products");
};
