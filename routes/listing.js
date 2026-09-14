const express = require("express");
const router = express.Router();

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const { listingSchema } = require("../schema.js");

const {
    isLoggedIn,
    isOwner
} = require("../middleware.js");

const listings = require("../controllers/listings.js");

// VALIDATE LISTING
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        const errMsg = error.details
            .map((el) => el.message)
            .join(",");

        throw new ExpressError(400, errMsg);
    }

    next();
};

// INDEX + CREATE
router
    .route("/")
    .get(
        wrapAsync(listings.index)
    )
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listings.createListing)
    );

// NEW FORM
router.get(
    "/new",
    isLoggedIn,
    listings.renderNewForm
);

// SHOW + UPDATE + DELETE
router
    .route("/:id")
    .get(
        wrapAsync(listings.showListing)
    )
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listings.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listings.destroyListing)
    );

// EDIT FORM
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listings.renderEditForm)
);

module.exports = router;