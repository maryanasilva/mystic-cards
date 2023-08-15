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

        // Found card
        let chosenCard = await Card.findById(id).populate("reviews");
        await chosenCard.populate({
            path: "reviews",
            populate: {
                path: "author",
                model: "User",
            },
        });

        console.log(chosenCard);

        // current User

        /*// Test chosen card
        console.log(chosenCard);
        */

        res.render("cards/card-details.hbs", { card: chosenCard, user });
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

        const newReview = await Review.create({ content });

        // Update the book with new review that was created
        await Card.findByIdAndUpdate(cardId, {
            $push: { reviews: newReview._id },
        });

        // add the user to the review
        await Review.findByIdAndUpdate(newReview._id, {
            $push: { author: user._id },
        });

        res.redirect(`/cards/${cardId}`);
    } catch (error) {
        console.log(error);
    }
});

// DELETE REVIEW
router.post("/cards/:reviewId", async (req, res) => {
    const { reviewId } = req.params;
    try {
        const removeReview = await Review.findByIdAndDelete(reviewId);
        await User.findByIdAndUpdate(removedReview.author, {
            $pull: { reviews: removeReview._id },
        });
    } catch (error) {
        console.log(error);
    }

    res.redirect("/cards");
});

module.exports = router;
