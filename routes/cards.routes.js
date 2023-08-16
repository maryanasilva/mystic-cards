const express = require("express");
const router = express.Router();

// CARD MODEL
const Card = require("../models/Card.model");
const User = require("../models/User.model");
const Review = require("../models/Review.model");

router.get("/cards", async (req, res) => {
    try {
        let cardsDB = await Card.find();

        /*// Test all cards
        console.log(cardsDB[0]);
        */

        res.render("cards/cards-list.hbs", { cards: cardsDB });
    } catch (error) {
        console.log(error);
    }
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

        res.render("cards/card-details.hbs", { card: chosenCard, user, isFav });
    } catch (error) {
        console.log(error);
    }
});

/* REVIEW CARD */
router.post("/review/create/:cardId", async (req, res) => {
    try {
        const { cardId } = req.params;

        const { content } = req.body;
        const user = req.session.currentUser;

        let newReview = await Review.create({ content });

        // Update the card with new review that was created
        await Card.findByIdAndUpdate(cardId, {
            $push: { reviews: newReview._id },
        });

        // add the user to the review
        await Review.findByIdAndUpdate(newReview._id, {
            $push: { author: user._id },
        });

        // add the card to the review
        await Review.findByIdAndUpdate(newReview._id, {
            $push: { card_object: cardId },
        });

        // add review to the user
        await User.findByIdAndUpdate(user._id, {
            $push: { reviews: newReview._id },
        });

        res.redirect(`/cards/${cardId}`);
    } catch (error) {
        console.log(error);
    }
});

/** MY REVIEWS **/

router.get("/myReviews", async (req, res) => {
    try {
        // Get info user
        let user = req.session.currentUser;
        // Get reviews to cards
        user = await User.findById(user._id).populate("reviews");

        await user.populate({
            path: "reviews",
            populate: {
                path: "card_object",
                model: "Card",
            },
        });

        res.render("cards/my-reviews.hbs", {
            reviews: user.reviews,
            layout: "layout-login.hbs",
        });
    } catch (error) {
        console.log(error);
    }
});

router.post("/review/delete/:reviewId", async (req, res) => {
    const { reviewId } = req.params;
    try {
        // Remove Review from reviews
        const removedReview = await Review.findByIdAndDelete(reviewId);

        // Remove Review from User
        await User.findByIdAndUpdate(removedReview.author, {
            $pull: { reviews: removedReview._id },
        });

        // Get id card
        const idCard = removedReview.card_object._id;

        // Remove Review from Card
        await Card.findByIdAndUpdate(idCard, {
            $pull: { reviews: removedReview._id },
        });
    } catch (error) {
        console.log(error);
    }

    res.redirect("/myReviews");
});

/** MY FAVOURITES **/

// Display favourites
router.get("/myFavourites", async (req, res) => {
    try {
        // Get info user
        let user = req.session.currentUser;
        // Get reviews to cards
        user = await User.findById(user._id).populate("favourites");

        res.render("cards/my-favourites.hbs", {
            favourites: user.favourites,
            layout: "layout-login.hbs",
        });
    } catch (error) {
        console.log(error);
    }
});

// Add card to favourites
router.post("/favourite/add/:cardId", async (req, res) => {
    try {
        const { cardId } = req.params;

        const user = req.session.currentUser;

        await User.findByIdAndUpdate(user._id, {
            $push: { favourites: cardId },
        });

        res.redirect(`/cards/${cardId}`);
    } catch (error) {
        console.log(error);
    }
});

// Remove card from cards(favourites)
router.post("/favourite/remove/:cardId", async (req, res) => {
    try {
        const { cardId } = req.params;

        const user = req.session.currentUser;

        await User.findByIdAndUpdate(user._id, {
            $pull: { favourites: cardId },
        });

        res.redirect(`/cards/${cardId}`);
    } catch (error) {
        console.log(error);
    }
});

//Remove card from myFavourites
router.post("/favourite/removeFromFav/:cardId", async (req, res) => {
    try {
        const { cardId } = req.params;

        const user = req.session.currentUser;

        await User.findByIdAndUpdate(user._id, {
            $pull: { favourites: cardId },
        });

        res.redirect("/myFavourites");
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
