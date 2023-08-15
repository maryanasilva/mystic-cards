const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const cardSchema = new Schema({
    name: String,
    type_line: String,
    rarity: String,
    oracle_text: String,
    flavor_text: String,
    artist: String,
    released_at: String,
    collector_number: String,
    image_uris: {
        small: String,
        normal: String,
        large: String,
        png: String,
        art_crop: String,
        border_crop: String,
    },
    colors: [String],
    color_identity: { String },
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
