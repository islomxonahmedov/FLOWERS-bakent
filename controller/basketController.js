const Basket = require("../model/basketsModel");
const mongoose = require("mongoose");

const addToBasketFunc = async (req, res) => {
    try {
        const { userId, flowerId, count } = req.params;

        // Check if userId is valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Check if flowerId is valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(flowerId)) {
            return res.status(400).json({ message: "Invalid flower ID" });
        }

        // Find or create a basket for the user
        let basket = await Basket.findOne({ user: userId });

        if (!basket) {
            basket = new Basket({ user: userId, items: [] });
        }

        // Check if the flower is already in the basket
        const itemIndex = basket.items.findIndex(item => item.flower.toString() === flowerId);

        if (itemIndex > -1) {
            // Mahsulot savatda allaqachon bor, foydalanuvchiga xabar yuborish
            return res.status(200).json({ message: "Bu mahsulot allaqachon savatda bor" });
        } else {
            // Mahsulotni savatga qo'shish
            basket.items.push({ flower: flowerId, count });
        }

        await basket.save();
        res.status(200).json({ message: "Muvaffaqiyatli saqlandi" });
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
};

const getBasketItems = async (req, res) => {
    try {
        const { userId } = req.params;

        // userId validligini tekshirish
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Foydalanuvchining savatini topish va mahsulotlarni populate qilish
        const basket = await Basket.findOne({ user: userId }).populate('items.flower');

        // Savatning mavjudligini va items bo'sh emasligini tekshirish
        if (!basket || !basket.items || basket.items.length === 0) {
            return res.status(200).json({ message: "Sizning basketingizda mahsulot topilmadi" });
        }

        // Basketni qaytarish
        res.status(200).json({ items: basket.items });
    } catch (error) {
        console.log("Error occurred:", error);
        res.status(500).json({ message: "Serverda xatolik yuz berdi", error: error.message });
    }
};

const removeFromBasketFunc = async (req, res) => {
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
        let basket = await Basket.findOne({ user: userId });

        // Agar savat topilmasa yoki bo'sh bo'lsa, xabar qaytarish
        if (!basket || !basket.items || basket.items.length === 0) {
            return res.status(200).json({ message: "Sizning basketingizda mahsulot topilmadi" });
        }

        // Savatdan mahsulotni o'chirish
        basket.items = basket.items.filter(item => item.flower.toString() !== flowerId);

        // Agar savat bo'shab qolsa, savatni o'chirish yoki saqlash
        if (basket.items.length === 0) {
            await Basket.deleteOne({ user: userId });
            return res.status(200).json({ message: "Savat bo'sh, barcha mahsulotlar o'chirildi" });
        }

        await basket.save();
        res.status(200).json({ message: "Mahsulot savatdan muvaffaqiyatli o'chirildi" });
    } catch (error) {
        console.log("Error occurred:", error);
        res.status(500).json({ message: "Serverda xatolik yuz berdi", error: error.message });
    }
};

const clearBaket = async (req, res) => {
    const { userId } = req.body;

    try {
        await Basket.findOneAndUpdate(
            { user: userId },
            { $set: { items: [] } }
        );
        res.status(200).json({ message: 'Savat tozalandi.' });
    } catch (error) {
        res.status(500).json({ message: 'Savatni tozalashda xatolik yuz berdi.' });
    }
};

module.exports = {
    addToBasketFunc,
    getBasketItems,
    removeFromBasketFunc,
    clearBaket
};
