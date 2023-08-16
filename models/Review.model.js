const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
    content: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    card_object: {
        type: Schema.Types.ObjectId,
        ref: "Card", // Model
    },
});

// we need to always export de module so that can be accessed anywhere
module.exports = model("Review", reviewSchema);
