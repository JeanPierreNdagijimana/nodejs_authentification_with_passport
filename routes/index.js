import express from "express";
export const router = express.Router();
import auth from "../config/auth.js";
// import { ensureAuthenticated } from "../config/auth.js";
//welcome page
router.get("/", (req, res) => res.render("welcome.ejs"));

//dashboard
router.get("/dashboard", auth.ensureAuthenticated, (req, res) =>
  res.render("dashboard.ejs", {
    name: req.user.name, //req.user is available because of passport)
  })
);

export default router;
