const express=require('express');
app=express();
const path=require('path');

const mongoose =require('mongoose');
const Listing = require('./models/listing');
const Review = require('./models/review');
const MONGO_URL = 'mongodb://127.0.0.1:27017/test';
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const {listingSchema}=require("./schema.js");
const session=require('express-session');
const flash=require('connect-flash');



const listings=require("./routes/listing.js");
main()
  .then(()=>{
    console.log("Connected to DB");
  })
  .catch((err)=>{
    console.log(err);
  });

async function main() {
    await mongoose.connect(MONGO_URL);
}
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
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  next();
});

app.get("/", async (req,res) => {
  const allListings=await Listing.find({});
  res.render("listings/index.ejs",{allListings});
});

app.use("/listings",listings);


// app.put("/:id", async (req,res)=>{
//   let id=req.params.id;
//   await Listing.findByIdAndUpdate(id,{...req.body.listing});
//   res.redirect("/listings")
// })

// app.delete("/:id", async (req,res)=>{
//   let id=req.params.id;
//   await Listing.findByIdAndDelete(id);
//   res.redirect("/listings")
// })
// app.get("/new",(req,res)=>{
//   res.render("listings/new.ejs");
// })
// app.get("/:id", async (req,res) => {
//   let id=req.params.id;
//   const listing=await Listing.findById(id).populate("reviews");
//   res.render("listings/show.ejs",{listing});
// });

// app.post("/", async (req, res) => {
//   const newListing = new Listing(req.body.listing);
//   await newListing.save();
//   res.redirect("/listings");
// });

// app.get("/:id/edit",async (req,res)=>{
//   let id=req.params.id;
//   const listing=await Listing.findById(id);
//   res.render("listings/edit.ejs",{listing});
// })

// app.post("/:id/reviews", async(req,res)=>{
//   let listing=await Listing.findById(req.params.id);
//   let newReview=new Review(req.body.review)

//   listing.reviews.push(newReview);

//   await newReview.save();
//   await listing.save();

//   res.redirect(`/listings/${listing._id}`);
// })
app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})