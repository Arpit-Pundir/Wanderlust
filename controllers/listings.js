const Listing = require("../models/listing.js");

const mbxGeocoding =
    require("@mapbox/mapbox-sdk/services/geocoding");

const mapToken =
    process.env.MAP_TOKEN;

const geocodingClient =
    mbxGeocoding({
        accessToken: mapToken,
    });

// INDEX
module.exports.index = async (req, res) => {
    const allListings =
        await Listing.find({});

    res.render(
        "listings/index.ejs",
        {
            allListings,
        }
    );
};

// NEW FORM
module.exports.renderNewForm = (req, res) => {
    res.render(
        "listings/new.ejs"
    );
};

// SHOW
module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    const listing =
        await Listing
            .findById(id)
            .populate({
                path: "reviews",
                populate: {
                    path: "author",
                },
            })
            .populate("owner");

    if (!listing) {
        req.flash(
            "error",
            "Listing you requested for does not exist!"
        );

        return res.redirect(
            "/listings"
        );
    }

    res.render(
        "listings/show.ejs",
        {
            listing,
        }
    );
};

// CREATE
module.exports.createListing = async (req, res) => {

    // GET COORDINATES FROM MAPBOX
    const response =
        await geocodingClient
            .forwardGeocode({
                query:
                    req.body.listing.location,
                limit: 1,
            })
            .send();

    const newListing =
        new Listing(
            req.body.listing
        );

    newListing.owner =
        req.user._id;

    // STORE GEOMETRY
    newListing.geometry =
        response.body
            .features[0]
            .geometry;

    // STORE IMAGE
    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename:
                req.file.filename,
        };
    }

    await newListing.save();

    req.flash(
        "success",
        "New Listing Created!"
    );

    res.redirect(
        "/listings"
    );
};

// EDIT FORM
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;

    const listing =
        await Listing.findById(id);

    if (!listing) {
        req.flash(
            "error",
            "Listing you requested for does not exist!"
        );

        return res.redirect(
            "/listings"
        );
    }

    res.render(
        "listings/edit.ejs",
        {
            listing,
        }
    );
};

// UPDATE
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    const listing =
        await Listing.findByIdAndUpdate(
            id,
            {
                ...req.body.listing,
            },
            {
                runValidators: true,
                new: true,
            }
        );

    if (!listing) {
        req.flash(
            "error",
            "Listing you requested for does not exist!"
        );

        return res.redirect(
            "/listings"
        );
    }

    // NEW IMAGE
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename:
                req.file.filename,
        };

        await listing.save();
    }

    req.flash(
        "success",
        "Listing Updated!"
    );

    res.redirect(
        `/listings/${id}`
    );
};

// DELETE
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;

    const deletedListing =
        await Listing.findByIdAndDelete(
            id
        );

    if (!deletedListing) {
        req.flash(
            "error",
            "Listing you requested for does not exist!"
        );

        return res.redirect(
            "/listings"
        );
    }

    req.flash(
        "success",
        "Listing Deleted!"
    );

    res.redirect(
        "/listings"
    );
};