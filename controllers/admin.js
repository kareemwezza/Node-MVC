const { validationResult } = require("express-validator");
const Product = require("../models/product");
const fileHelper = require("../utils/fileHelper");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, price, description } = req.body;
  const image = req.file;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      docTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      product: {
        title: title,
        price: price,
        description: description,
      },
    });
  }
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      docTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      errorMessage: "Invalid File type Attached! please try again.",
      validationErrors: [],
      product: {
        title: title,
        price: price,
        description: description,
      },
    });
  }
  const imageUrl = image.path;
  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user._id,
  });
  product
    .save()
    .then(() => res.redirect("/admin/products"))
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const productId = req.params.productId;
  Product.findById(productId).then((product) => {
    if (!product) {
      return res.redirect("/admin/products");
    }
    res.render("admin/edit-product", {
      docTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      hasError: false,
      errorMessage: null,
      validationErrors: [],
      product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, description } = req.body;
  const image = req.file;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      docTitle: "Edit Product",
      path: "/admin/add-product",
      editing: true,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      product: {
        title: title,
        price: price,
        description: description,
        _id: productId,
      },
    });
  }

  let updatedProduct = {
    title,
    price,
    description,
  };
  if (image) {
    updatedProduct.imageUrl = image.path;
  }

  Product.findOneAndUpdate(
    { _id: productId, userId: req.user._id },
    updatedProduct
  )
    .then((oldProduct) => {
      image && fileHelper.deleteFile(oldProduct.imageUrl);
      console.log("PRODUCT UPDATED!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        docTitle: "All Products",
        products,
        path: "/admin/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.findOneAndDelete({ _id: productId, userId: req.user._id })
    .then((product) => {
      fileHelper.deleteFile(product.imageUrl);
      console.log("PRODUCT DELETED!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findOneAndDelete({ _id: productId, userId: req.user._id })
    .then((product) => {
      fileHelper.deleteFile(product.imageUrl);
      console.log("PRODUCT DELETED!");
      res.status(200).json({ message: "Product deleted successfully!." });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "An error has been occured, please try again.",
      });
    });
};
