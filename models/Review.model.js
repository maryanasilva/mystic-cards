const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
    content: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

// we need to always export de module so that can be accessed anywhere
module.exports = model("Review", reviewSchema);
