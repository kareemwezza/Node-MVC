const path = require("path");

const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", adminController.getAddProduct);

// /admin/edit-product/id => GET
router.get("/edit-product/:productId", adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    body(
      "title",
      "Must have a title with no sprcial charachters at least 3 char."
    )
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("price", "Must be a decimal number.").isFloat(),
    body("description", "Must be betwwn 10 and 400 characters.")
      .isLength({ min: 10, max: 400 })
      .trim(),
  ],
  adminController.postEditProduct
);

// admin/products => Get
router.get("/products", adminController.getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  [
    body(
      "title",
      "Must have a title with no special charachters at least 3 char."
    )
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body("price", "Must be a decimal number.").isFloat(),
    body("description", "Must be betwwn 10 and 400 characters.")
      .isLength({ min: 10, max: 400 })
      .trim(),
  ],
  adminController.postAddProduct
);

router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
