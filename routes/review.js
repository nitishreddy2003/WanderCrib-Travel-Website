const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/review');
const Listing = require('../models/listing');
const { isLoggedIn,isReviewAuthor } = require('../middleware');

// Create a new review for a listing
router.post("/",isLoggedIn, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        const newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// Delete a review by reviewId
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, async (req, res) => {
    try {
        const { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
