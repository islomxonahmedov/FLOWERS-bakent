const Flowerss = require("../model/bookModel");
const Joi = require('joi');
const Auth = require("../model/authModel");
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const getAllFlowerssFunc = async (req, res) => {
    try {
        const { nomi, cat } = req.query;
        const nomiRegEx = new RegExp(nomi, "i");

        let query = { nomi: nomiRegEx };

        if (cat) {
            if (ObjectId.isValid(cat)) {
                query.cat = new ObjectId(cat);
            } else {
                return res.status(400).json({ message: "Invalid category ID" });
            }
        }

        const books = await Flowerss
            .find(query)
            .populate("avtor")
            .populate("cat");

        res.status(200).json(books);
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
};

const getOneFlowersFunc = async (req, res) => {
    try {
        const id = req.params.id;
        // Ma'lumotlar omboridan flowersni izlab topish
        const flowers = await Flowerss.findById(id)
            .populate("avtor")
            .populate("cat");
        // Izlash natijasida flowers topilmasa
        if (!flowers) return res.status(404).send("Afsuski flowers topilmadi!");
        // Topilgan flowersni clientga qaytarib berish
        res.status(200).send(flowers);
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
};

const createNewFlowersFunc = async (req, res) => {
    try {
        const role = req.authRole;
        if (!role) return res.status(403).send("Sizga buni qilish taqiqlangan!");

        // Serverga kelgan so'rovni tekshirish
        const { error } = validateFunction(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // Agar validatsiya jarayonida hech qanday xato kuzatilmasa, u holda yangi kitob obyetki tuziladi
        const newFlowers = new Flowerss(req.body);

        // Hosil bo'lgan yangi kitob obyektini kitoblar ro'yhatiga qo'shish
        await newFlowers.save();

        // Clientga yangi kitobni qaytarish
        res.status(201).json({ data: newFlowers, message: "Yangi kitob qo'shildi" });
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
};

const updateFlowersFunc = async (req, res) => {
    try {
        const id = req.params.id;

        // Yangi flowers ma'lumotlarini validatsiya qilish
        const { error } = validateFunction(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // flowersni yangilash
        const updatedFlowers = await Flowerss.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedFlowers) return res.status(404).send("Afsuski flowers topilmadi!");

        // Clientga yangilangan flowersni qaytarish
        res.status(200).send(updatedFlowers);
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
};

const deleteFlowersFunc = async (req, res) => {
    try {
        // Ko'rsatilgan flowersni index'ni izlab topish
        const deletedFlowers = await Flowerss.findByIdAndDelete(req.params.id);
        if (!deletedFlowers) return res.status(404).send("Afsuski flowers topilmadi!");

        // O'chirib yuborilgan flowersni clientga qaytarish
        res.status(200).send(deletedFlowers);
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
};

const getFlowerssByCategory = async (req, res) => {
    try {
        const books = await Flowerss.find({ cat: req.params.categoryId }).populate("avtor cat");
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Validate funksiyasi
const validateFunction = (flowers) => {
    // Validate schema - sxemada obyektni qanday xossalari bo’lishi kerakligi va o’sha xossalarni turlari qanaqa bo’lishi, xossani qiymati eng kamida qancha bo’lishi yoki eng uzog’i bilan qancha bo’lishi ko'rsatib o'tiladi.
    const schema = Joi.object({
        nomi: Joi.string().required().min(3).max(30),
        narxi: Joi.number(),
        cat: Joi.string(),
        img: Joi.string(),
        description: Joi.string(),
        avtor: Joi.string(),
    });

    // Validatsiya natijasini funksiyaga qaytarish
    return schema.validate(flowers);
};

module.exports = {
    getAllFlowerssFunc,
    getOneFlowersFunc,
    createNewFlowersFunc,
    updateFlowersFunc,
    deleteFlowersFunc,
    getFlowerssByCategory,
};