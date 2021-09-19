const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getIndex = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render("shop/index", {
      docTitle: "My Shop",
      products,
      path: "/",
    });
  });
};

exports.getProducts = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render("shop/product-list", {
      docTitle: "All Products",
      products,
      path: "/products",
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findProductById(prodId, (product) => {
    res.render("shop/product-detail", {
      docTitle: `My Shop | ${product.title}`,
      product,
      path: "/products",
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      products.forEach((product) => {
        const cartProductData = cart.products.find(
          (prod) => product.id === prod.id
        );
        if (cartProductData) {
          cartProducts.push({
            productData: product,
            quantity: cartProductData.quantity,
          });
        }
      });
      res.render("shop/cart", {
        docTitle: "My Cart",
        path: "/cart",
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findProductById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect("/cart");
};

exports.postCartDelete = (req, res, next) => {
  const { productId } = req.body;
  const product = Product.findProductById(productId, (product) => {
    Cart.delete(productId, product.price);
    res.redirect("/cart");
  });
};

exports.getCheckOut = (req, res, next) => {
  res.render("shop/checkout", {
    docTitle: "Check Out",
    path: "/checkout",
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    docTitle: "Your Orders",
    path: "/orders",
  });
};
