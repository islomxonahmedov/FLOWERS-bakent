const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "auth",
        required: true
    },
    items: [
        {
            flower: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "flowers",
                required: true
            },
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("like", likeSchema);
