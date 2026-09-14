const mongoose = require("mongoose");

const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    // Find delta-student user
    const ownerUser = await User.findOne({
        username: "arpit123",
    });

    if (!ownerUser) {
        console.log("delta-student user not found!");
        return;
    }

    // Delete old listings
    await Listing.deleteMany({});

    // Give every seeded listing the same owner
    const listingsWithOwner = initData.data.map((obj) => ({
        ...obj,
        owner: ownerUser._id,
    }));

    // Insert listings again
    await Listing.insertMany(listingsWithOwner);

    console.log(
        `Data initialized with owner: ${ownerUser.username}`
    );
};

initDB();