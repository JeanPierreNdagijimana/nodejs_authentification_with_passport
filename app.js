import express from "express";
import router from "./routes/index.js";
import userRouter from "./routes/users.js";
import expressLayouts from "express-ejs-layouts";
import mongoose from "mongoose";
import passport from "passport";
import keys from "./config/keys.js";
import session from "express-session";
import flash from "connect-flash";
// import { session } from "passport";

const app = express();

//passport config
import "./config/passport.js";

//DB config
const db = keys.MongoURI;

//connect to Mongo
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

//EJS middleware
app.use(expressLayouts);
app.set("view engine", "ejs");

//Bodyparser
app.use(express.urlencoded({ extended: false }));

//express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.errors = req.flash("errors");
  next();
});

//routes
app.use("/", router);
app.use("/users", userRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server started on port ${PORT}`));
