const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const cardSchema = new Schema({
    name: String,
    released_at: String,
    image_uris: {
        small: String,
        normal: String,
        large: String,
        png: String,
        art_crop: String,
        border_crop: String,
    },
    rarity: String,
    artist: String,
    colors: [String],
    color_identity: { String },
    oracle_text: String,
    type_line: String,
    mana_cost: String,
    //prices: Object String
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
});

module.exports = model("Card", cardSchema);

/* ,*/
