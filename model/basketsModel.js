const mongoose = require("mongoose");

const basketSchema = new mongoose.Schema({
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
            count: {
                type: Number,
                default: 1,
                required: true
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("basket", basketSchema);
