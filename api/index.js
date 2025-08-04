// api/index.js
const { createServer } = require("http");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");




const Listing = require('./models/listing');
const Review = require('./models/review');

// const MONGO_URL = 'mongodb://127.0.0.1:27017/test';
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const {listingSchema}=require("./schema.js");
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');
const wrapasync=require('./utils/wrapAsync.js')

const listingRoute=require("./routes/listing.js");
const reviewRoute=require('./routes/review.js');
const userRoute=require("./routes/user.js");
// ... rest of your imports (models, routes, passport, etc.)
require("dotenv").config();

const app = express();

// … All your express middleware, Mongoose connect, routes, etc. …

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Connected to DB");
})
.catch((err) => {
  console.error("DB connection error:", err);
});

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);

const sessionOptions={
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error= req.flash("error");
  res.locals.currUser=req.user;
  next();
})
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
});

app.get('/demouser',async(req,res)=>{
  let fakeUser=new User({
    email:"abcd.123@apna.com",
    username:"testUser"
  });

  let registeredUSer=await User.register(fakeUser,"12345");
  res.send(registeredUSer);
});

app.get("/", async (req,res) => {
  const allListings=await Listing.find({});
  res.render("listings/index.ejs",{allListings});
});

app.use("/listings",listingRoute);
app.use("/listings/:id/reviews",reviewRoute);
app.use("/",userRoute);
// static, view engine, session, passport, etc.
// your routes...

// IMPORTANT: No app.listen()

// Export the handler for Vercel
module.exports = app;
