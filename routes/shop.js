const path = require("path");

const express = require("express");

const shopcontroller = require("../controllers/shop");

const router = express.Router();

router.get("/", shopcontroller.getIndex);
router.get("/products", shopcontroller.getProducts);
router.get("/products/:productId", shopcontroller.getProduct);
router.get("/cart", shopcontroller.getCart);
router.post("/cart", shopcontroller.postCart);
router.post("/cart-delete-item", shopcontroller.postCartDelete);
// router.get("/checkout", shopcontroller.getCheckOut);
router.get("/orders", shopcontroller.getOrders);
router.post("/create-order", shopcontroller.postOrder);

module.exports = router;
