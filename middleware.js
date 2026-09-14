const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

// CHECK IF USER IS LOGGED IN
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;

        req.flash(
            "error",
            "You must be logged in first!"
        );

        return res.redirect("/login");
    }

    next();
};

// SAVE ORIGINAL URL FOR POST-LOGIN REDIRECT
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
};

// CHECK IF CURRENT USER OWNS THE LISTING
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash(
            "error",
            "Listing you requested for does not exist!"
        );

        return res.redirect("/listings");
    }

    if (
        !listing.owner ||
        !listing.owner.equals(req.user._id)
    ) {
        req.flash(
            "error",
            "You don't have permission to edit this listing!"
        );

        return res.redirect(`/listings/${id}`);
    }

    next();
};

// CHECK IF CURRENT USER WROTE THE REVIEW
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash(
            "error",
            "Review does not exist!"
        );

        return res.redirect(`/listings/${id}`);
    }

    if (
        !review.author ||
        !review.author.equals(req.user._id)
    ) {
        req.flash(
            "error",
            "You don't have permission to delete this review!"
        );

        return res.redirect(`/listings/${id}`);
    }

    next();
};