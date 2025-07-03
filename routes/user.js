const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");

const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// Signup routes
router.route("/signup")
  .get(userController.renderSignUp)
  .post(userController.signUp);

// Login routes
router.route("/login")
  .get(userController.renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true
    }),
    userController.login
  );

// Logout route
router.get("/logout", userController.logout);

module.exports = router;

