const express = require("express");
const router = express.Router();

// CARD MODEL
const Card = require("../models/Card.model");

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
        const users = await User.find();
        // Get CARD ID
        const { id } = req.params;

        // Found card
        let chosenCard = await Card.findById(id);

        await foundBook.populate("reviews author");

        await foundBook.populate({
            path: "reviews",
            populate: {
                path: "author",
                model: "User",
            },
        });

        /*// Test chosen card
        console.log(chosenCard);
        */

        res.render("cards/card-details.hbs", { card: chosenCard, users });
    } catch (error) {
        console.log(error);
    }
});

/* REVIEW CARD */
router.post("/review/create/:cardId", async (req, res) => {
    try {
        const { cardId } = req.params;

        const { content, author } = req.body;

        const newReview = await Review.create({ content, author });

        // Update the book with new review that was created
        const cardUpdate = await Book.findByIdAndUpdate(cardId, {
            $push: { reviews: newReview._id },
        });

        // add the review to the user
        const userUpdate = await User.findByIdAndUpdate(author, {
            $push: { reviews: newReview._id },
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
