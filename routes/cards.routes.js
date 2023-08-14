const express = require("express");
const router = express.Router();

// CARD MODEL
const Card = require("../models/Card.model");

router.get("/cards", async (req, res) => {
    try {
        let cardsDB = await Card.find();
        console.log(cardsDB[0]);
        res.render("cards/cards-list.hbs", { cards: cardsDB });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
