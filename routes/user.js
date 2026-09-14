const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/user.js");

const {
    saveRedirectUrl
} = require("../middleware.js");

// SIGNUP - GET
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// SIGNUP - POST
router.post("/signup", async (req, res, next) => {
    try {
        let { username, email, password } = req.body;

        const newUser = new User({
            email,
            username,
        });

        const registeredUser = await User.register(
            newUser,
            password
        );

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash(
                "success",
                "Welcome to WanderLust!"
            );

            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
});

// LOGIN - GET
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// LOGIN - POST
router.post(
    "/login",

    saveRedirectUrl,

    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),

    async (req, res) => {
        req.flash(
            "success",
            "Welcome back to WanderLust!"
        );

        let redirectUrl =
            res.locals.redirectUrl || "/listings";

        res.redirect(redirectUrl);
    }
);

// LOGOUT
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash(
            "success",
            "You are logged out!"
        );

        res.redirect("/listings");
    });
});

module.exports = router;