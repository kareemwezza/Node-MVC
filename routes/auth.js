const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignUp);

router.get("/reset", authController.getReset);

router.get("/reset/:token", authController.getNewPassword);

router.post(
  "/login",
  [
    body("email", "Please enter a valid E-mail Adress")
      .isEmail()
      .normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Please Enter a valid Password")
      .trim(),
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        // custom fun that validate input when throw err or reject a promise
        // if returns true or promise this pass validation
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "User already exists using this E-mail please login or use a different one."
            );
          }
        });
      })
      .normalizeEmail(),
    check(
      "password",
      "Please enter a password with only number and text at least 6 characters"
    )
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw Error("Password Have to match!.");
        }
        return true;
      }),
  ],
  authController.postSignUp
);

router.post("/reset", authController.postReset);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
