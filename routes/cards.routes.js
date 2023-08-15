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
        const { id } = req.params;

        let chosenCard = await Card.findById(id);

        console.log(chosenCard);

        /*// Test chosen card
        console.log(chosenCard);
        */

        res.render("cards/card-details.hbs", { card: chosenCard });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
