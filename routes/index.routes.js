const express = require("express");
const router = express.Router();

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// CARD MODEL
const Card = require("../models/Card.model");
const User = require("../models/User.model");
const Review = require("../models/Review.model");

/* GET home page */
router.get("/", async (req, res, next) => {
    let isLog = false;
    let allCards = await Card.find();
    let rCards = [];

    for (let i = 0; i < 4; i++) {
        let num = Math.floor(Math.random() * (1000 - 0 + 1)) + 0;
        rCards.push(allCards[num]);
    }

    const user = req.session.currentUser;
    if (user) {
        isLog = true;
    }
    let putLayout = "";

    if (user) {
        putLayout = "layout-login.hbs";
    } else {
        putLayout = "layout.hbs";
    }
    console.log(isLog);
    res.render("index", {
        isLog,
        randomCards: rCards,
        layout: putLayout,
    });
});

/* GET How to Play Page LogOut */
/* router.get("/how-to-play", (req, res, next) => {
  res.render("how-to-play");
}); */

/* GET How to Play Page */
router.get("/how-to-play", (req, res) => {
    const user = req.session.currentUser;
    let putLayout = "";

    if (user) {
        putLayout = "layout-login.hbs";
    } else {
        putLayout = "layout.hbs";
    }
    res.render("how-to-play", {
        userInSession: req.session.currentUser,
        layout: putLayout,
    });
});

// DETAIL CARD
router.get("/cards/:id", async (req, res) => {
    try {
        // Get user
        const user = req.session.currentUser;
        // Get CARD ID
        const { id } = req.params;
        let isFav;

        const thisUser = await User.findById(user._id);

        console.log(thisUser);

        if (thisUser.favourites.includes(`${id}`)) {
            isFav = true;
        }

        // Found card
        let chosenCard = await Card.findById(id).populate("reviews");
        await chosenCard.populate({
            path: "reviews",
            populate: {
                path: "author",
                model: "User",
            },
        });

        // current User

        /*// Test chosen card
        console.log(chosenCard);
        */

        res.render("cards/card-details.hbs", {
            card: chosenCard,
            user,
            isFav,
            layout: "layout-login.hbs",
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
