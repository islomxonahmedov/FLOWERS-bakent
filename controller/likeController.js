const Like = require("../model/likeModel");
const mongoose = require("mongoose");

const addToLikeFunc = async (req, res) => {
    try {
        const { userId, flowerId } = req.params;

        // Check if userId is valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Check if flowerId is valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(flowerId)) {
            return res.status(400).json({ message: "Invalid flower ID" });
        }

        // Find or create a like for the user
        let like = await Like.findOne({ user: userId });

        if (!like) {
            like = new Like({ user: userId, items: [] });
        }

        // Check if the flower is already in the like
        const itemIndex = like.items.findIndex(item => item.flower.toString() === flowerId);

        if (itemIndex > -1) {
            // Mahsulot savatda allaqachon bor, foydalanuvchiga xabar yuborish
            return res.status(200).json({ message: "Bu mahsulot allaqachon savatda bor" });
        } else {
            // Mahsulotni savatga qo'shish
            like.items.push({ flower: flowerId });
        }

        await like.save();
        res.status(200).json({ message: "Muvaffaqiyatli saqlandi" });
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
};

const getLikeItems = async (req, res) => {
    try {
        const { userId } = req.params;

        // userId validligini tekshirish
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Foydalanuvchining savatini topish va mahsulotlarni populate qilish
        const like = await Like.findOne({ user: userId }).populate('items.flower');

        // Savatning mavjudligini va items bo'sh emasligini tekshirish
        if (!like || !like.items || like.items.length === 0) {
            return res.status(200).json({ message: "Sizning basketingizda mahsulot topilmadi" });
        }

        // Basketni qaytarish
        res.status(200).json({ items: like.items });
    } catch (error) {
        console.log("Error occurred:", error);
        res.status(500).json({ message: "Serverda xatolik yuz berdi", error: error.message });
    }
};

const removeFromLikeFunc = async (req, res) => {
    try {
        const { userId, flowerId } = req.params;

        // userId validligini tekshirish
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // flowerId validligini tekshirish
        if (!mongoose.Types.ObjectId.isValid(flowerId)) {
            return res.status(400).json({ message: "Invalid flower ID" });
        }

        // Foydalanuvchining savatini topish
        let like = await Like.findOne({ user: userId });

        // Agar savat topilmasa yoki bo'sh bo'lsa, xabar qaytarish
        if (!like || !like.items || like.items.length === 0) {
            return res.status(200).json({ message: "Sizning basketingizda mahsulot topilmadii" });
        }

        // Savatdan mahsulotni o'chirish
        like.items = like.items.filter(item => item.flower.toString() !== flowerId);

        // Agar savat bo'shab qolsa, savatni o'chirish yoki saqlash
        if (like.items.length === 0) {
            await Like.deleteOne({ user: userId });
            return res.status(200).json({ message: "Savat bo'sh, barcha mahsulotlar o'chirildi" });
        }

        await like.save();
        res.status(200).json({ message: "Mahsulot savatdan muvaffaqiyatli o'chirildi" });
    } catch (error) {
        console.log("Error occurred:", error);
        res.status(500).json({ message: "Serverda xatolik yuz berdi", error: error.message });
    }
};

module.exports = {
    addToLikeFunc,
    getLikeItems,
    removeFromLikeFunc,
};