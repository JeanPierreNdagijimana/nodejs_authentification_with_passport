import express from "express";
import bcrypt from "bcryptjs";
import passport from "passport";
import flash from "connect-flash";
import failureFlash from "connect-flash";
import session from "express-session";
const userRouter = express.Router();
import LocalStrategy from "passport-local";
import mongoose from "mongoose";
import passportStrategy from "../config/passport.js";
passportStrategy(passport);

//User model
import User from "../models/User.js";
import keys from "../config/keys.js";

//Login Page
userRouter.get("/login", (req, res) => res.render("login.ejs"));

//Register Page
userRouter.get("/register", (req, res) => res.render("register.ejs"));

//Register Handle
userRouter.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }
  //check passwords match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }
  //check pass length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }
  //if there are errors
  if (errors.length > 0) {
    res.render("register.ejs", {
      errors: errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    //validation passed
    User.findOne({ email: email }).then((user) => {
      if (user) {
        //user exists
        errors.push({ msg: "Email is already registered" });
        res.render("register.ejs", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });
        //hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //set password to hashed
            newUser.password = hash;
            //save user
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
});

//login handle
userRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

//logout handle
userRouter.get("/logout", (req, res) => {
  req.logout({}, (err) => {
    if (err) {
      console.log(err);
    } else {
      req.flash("success_msg", "You are logged out");
      res.redirect("/users/login");
    }
  });
});

export default userRouter;
