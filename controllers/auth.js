const User = require("../models/user");
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    docTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("61520c2548a04b32be67de08")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      // not neccessary but to ensure redirection is after saving session on DB
      req.session.save((err) => {
        // console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    // console.log(err);
    res.redirect("/");
  });
};
