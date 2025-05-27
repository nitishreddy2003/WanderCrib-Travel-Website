const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const Review = require('../models/review'); // Don't forget to include this!
const {isLoggedIn}=require('../middleware.js');

// Index Route
router.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

// New Listing Form
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

// Create Listing
router.post("/", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
});

// Show Specific Listing
router.get("/:id", async (req, res) => {
    let id = req.params.id;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        return res.status(404).send("Listing not found");
    }
    res.render("listings/show.ejs", { listing });
});

// Edit Form for Listing
router.get("/:id/edit", async (req, res) => {
    let id = req.params.id;
    const listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).send("Listing not found");
    }
    res.render("listings/edit.ejs", { listing });
});

// Update Listing
router.put("/:id",isLoggedIn, async (req, res) => {
    let id = req.params.id;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
});

// Delete Listing
router.delete("/:id",isLoggedIn, async (req, res) => {
    let id = req.params.id;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

// Add Review to Listing
// router.post("/:id/reviews", async (req, res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);

//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();

//     res.redirect(`/listings/${listing._id}`);
// });

// router.delete("/:id/reviews/:reviewId",async(req,res)=>{
//     let {id,reviewId}=req.params;

//     await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     await Review.findById(reviewId);

//     res.redirect(`/listings/${id}`);
// })

module.exports = router;
