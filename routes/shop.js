const path = require("path");

const express = require("express");

const isAuth = require("../middleware/is-auth");

const shopcontroller = require("../controllers/shop");

const router = express.Router();

router.get("/", shopcontroller.getIndex);
router.get("/products", shopcontroller.getProducts);
router.get("/products/:productId", shopcontroller.getProduct);
router.get("/cart", isAuth, shopcontroller.getCart);
router.post("/cart", isAuth, shopcontroller.postCart);
router.post("/cart-delete-item", isAuth, shopcontroller.postCartDelete);
router.get("/orders", isAuth, shopcontroller.getOrders);
router.post("/create-order", isAuth, shopcontroller.postOrder);

module.exports = router;
