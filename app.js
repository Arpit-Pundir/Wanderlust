if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("./models/user.js");

const ExpressError = require("./utils/ExpressError.js");
const { MongoStore } = require("connect-mongo");

// ROUTERS
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// DATABASE URL
const dbUrl = process.env.ATLASDB_URL;

// MONGO SESSION STORE
const store = MongoStore.create({
    mongoUrl: dbUrl,

    crypto: {
        secret: process.env.SECRET,
    },

    touchAfter: 24 * 3600,
});

// SESSION STORE ERROR
store.on("error", () => {
    console.log("ERROR IN MONGO SESSION STORE");
});

// SESSION OPTIONS
const sessionOptions = {
    store,

    secret: process.env.SECRET,

    resave: false,

    saveUninitialized: true,

    cookie: {
        expires:
            Date.now() +
            7 * 24 * 60 * 60 * 1000,

        maxAge:
            7 * 24 * 60 * 60 * 1000,

        httpOnly: true,
    },
};

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

// VIEW ENGINE
app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);

app.engine("ejs", ejsMate);

// MIDDLEWARES
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(methodOverride("_method"));

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

// SESSION
app.use(session(sessionOptions));

// FLASH
app.use(flash());

// PASSPORT
app.use(passport.initialize());

app.use(passport.session());

passport.use(
    new LocalStrategy(
        User.authenticate()
    )
);

passport.serializeUser(
    User.serializeUser()
);

passport.deserializeUser(
    User.deserializeUser()
);

// LOCALS
app.use((req, res, next) => {

    res.locals.success =
        req.flash("success");

    res.locals.error =
        req.flash("error");

    res.locals.currUser =
        req.user;

    res.locals.mapToken =
        process.env.MAP_TOKEN;

    next();
});

// HOME
app.get("/", (req, res) => {
    res.redirect("/listings");
});

// ROUTES
app.use(
    "/listings",
    listingRouter
);

app.use(
    "/listings/:id/reviews",
    reviewRouter
);

app.use(
    "/",
    userRouter
);

// 404
app.use((req, res, next) => {

    next(
        new ExpressError(
            404,
            "Page Not Found"
        )
    );

});

// ERROR HANDLER
app.use((err, req, res, next) => {

    const {
        statusCode = 500,
        message = "Something went wrong!",
    } = err;

    res
        .status(statusCode)
        .render(
            "listings/error.ejs",
            {
                message,
            }
        );

});

// SERVER
const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});