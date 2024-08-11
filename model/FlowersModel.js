const mongoose = require("mongoose");

// Ma'lumotlar omboriga saqlanishi kerak bo'lgan flowers sxemasi
const flowersSxemasi = mongoose.Schema(
    {
        nomi: String,
        price: Number,
        narxi: Number,
        width: Number,
        height: Number,
        cat: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
        img: [String],
        description: String,
        description2: String,
        avtor: { type: mongoose.Schema.Types.ObjectId, ref: "auth" },
        sales: { type: Number, default: 0 },
        comments: [{
            text: String,
            rating: Number,
            avtor: { type: mongoose.Schema.Types.ObjectId, ref: "auth" },
        }],
        total: { type: Number, default: 0 }
    },
    { timestamps: true }
);

module.exports = mongoose.model("flowers", flowersSxemasi);