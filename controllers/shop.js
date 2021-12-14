const fs = require("fs");
const path = require("path");
const PdfDoc = require("pdfkit");
const Product = require("../models/product");
const Order = require("../models/order");

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        docTitle: "My Shop",
        products,
        path: "/",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        docTitle: "All Products",
        products,
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        docTitle: `My Shop | ${product.title}`,
        product: product,
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      res.render("shop/cart", {
        docTitle: "My Cart",
        path: "/cart",
        products: user.cart.items,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postCartDelete = (req, res, next) => {
  const { productId } = req.body;
  req.user
    .removeFromCart(productId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getCheckOut = (req, res, next) => {
  res.render("shop/checkout", {
    docTitle: "Check Out",
    path: "/checkout",
  });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        docTitle: "Your Orders",
        path: "/orders",
        orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { product: { ...i.productId._doc }, quantity: i.quantity };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products,
      });
      return order.save();
    })
    .then(() => {
      req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const { orderId } = req.params;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No order found"));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unautherized user"));
      }
      const invoiceName = `invoice-${orderId}.pdf`;
      const invoicePath = path.join("data", "invoices", invoiceName);
      // const file = fs.createReadStream(invoicePath);
      res.setHeader(
        "Content-disposition",
        'inline; filename="' + invoiceName + '"'
      );
      res.setHeader("Content-type", "application/pdf");
      // file.pipe(res);
      // This reads the entire file and send it back = memory consume and not fine with large files
      /* fs.readFile(invoicePath, (err, data) => {
        if (err) {
          return next(err);
        }
        res.setHeader(
          "Content-disposition",
          'inline; filename="' + invoiceName + '"'
        );
        res.setHeader("Content-type", "application/pdf");
        res.send(data);
      }); */
      // creating pdf on the fly
      const pdf = new PdfDoc();
      pdf.pipe(fs.createWriteStream(invoicePath));
      pdf.pipe(res);
      pdf.fontSize(16).text("Order Invoice", { align: "center" });
      let totalPrice = 0;
      order.products.forEach((product) => {
        totalPrice += product.quantity * product.product.price;
        pdf.text(
          `${product.product.title} - ${product.product.price} x ${product.quantity}`
        );
      });
      pdf.text(`Total Price: ${totalPrice}`);
      pdf.end();
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(err);
    });
};
