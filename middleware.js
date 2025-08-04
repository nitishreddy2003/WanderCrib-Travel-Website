let Review=require('./models/review');
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error", "You have to login");
        return res.redirect("/login");
    }
    next();
};

module.exports.redirectUrl=(req,res,next)=>{
    res.locals.redirectUrl = req.session.redirectUrl || '/listings';
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params; // ✅ Get from URL, not body
    const review = await Review.findById(reviewId); // ✅ Await this

    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect("/listings");
    }

    // Assuming you store user in req.user (set by Passport)
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`); // ✅ Correct interpolation
    }

    next();
};