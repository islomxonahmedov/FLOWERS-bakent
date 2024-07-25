const passwordComplexity = require("joi-password-complexity");
const Auth = require('../model/authModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const signUpFunction = async (req, res) => {
    try {
        const { fullname, email, password, role } = req.body;

        const existingAuth = await Auth.findOne({ email });
        if (existingAuth) return res.status(400).send("Ushbu elektron pochta avval foydalanilgan");

        const { error } = await validatePasswordFunction(password);
        if (error) return res.status(400).send(error.details[0].message);

        const hashedPassword = await bcrypt.hash(password, 15);
        const newAuth = await Auth.create({
            fullname,
            email,
            password: hashedPassword,
            role,
            verified: false,
        });

        res.status(200).json({ message: "Xabar muvaffaqiyatli jo'natildi" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error);
    }
};
const signInFunction = async (req, res) => {
    try {
        const { email, password } = req.body;

        const foundAuth = await Auth.findOne({ email });
        if (!foundAuth) return res.status(404).send("Foydalanuvchi topilmadi, iltimos ro'yhatdan o'ting!");

        // Foydalanuvchi verifikatsiyadan o'tmagan bo'lsa
        if (!foundAuth.verified) return res.status(400).send("Foydalanuvchi verifikatsiyadan o'tmagan!");

        // Parolni tekshirish
        const isPassword = await bcrypt.compare(password, foundAuth.password);
        if (!isPassword) return res.status(400).send("Parol xato, iltimos qayta urinib ko'ring!");

        // JWT token yaratish
        const token = jwt.sign({ id: foundAuth._id, role: foundAuth.role }, process.env.JWT_KEY, { expiresIn: "30d" });
        res.status(201).json({ data: foundAuth, token });
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error);
    }
};

const getAuth = async (req, res) => {
    try {
        const foundAuth = await Auth.findById(req.authId)
        if (!foundAuth) return res.status(404).json("Foydalanuvchi topilmadi");

        res.status(200).json({ data: foundAuth });
    } catch (error) {
        console.log(error.message);
        res.status(500).json(error);
    }
};


const validatePasswordFunction = (password) => {
    const schema = {
        min: 8,
        max: 30,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 2,
    };

    return passwordComplexity(schema).validate(password);
};

module.exports = {
    signUpFunction,
    signInFunction,
    getAuth,
};