const passwordComplexity = require("joi-password-complexity");
const Auth = require('../model/authModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require("../config/sendMail");
const Verification = require("../model/verificationMoadal");
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

        sendMail(newAuth);
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

        if (!foundAuth.verified) return res.status(400).send("Foydalanuvchi verifikatsiyadan o'tmagan!");

        const isPassword = await bcrypt.compare(password, foundAuth.password);
        if (!isPassword) return res.status(400).send("Parol xato, iltimos qayta urinib ko'ring!");

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


const verificateUser = async (req, res) => {
    try {
        const { userId, uniqueId } = req.params;
        // todo: Eng avval verification modelidan kelgan so'rov bo'yicha ma'lumot bor yoki yo'qligini tekshirib olish zarur
        const existingVerification = await Verification.findOne({ userId });
        // todo: Agar yo'q bo'lsa mos ravishda html sahifani qaytarish
        if (!existingVerification) return res.render('error', { message: "Verifikatsiyadan o'tishda xatolik yoki allaqachon verifikatsiya qilib bo'lindi" });
        // todo: Agar bor bo'lsa verifikatsiyani muddatini tekshirish
        if (existingVerification.expiresIn < Date.now()) {
            // todo: Agar muddati o'tgan bo'lsa mos ravishda html sahifani qaytarish va verification model ma'lumoti hamda foydalanuvchi ma'lumotlarini database dan o'chirib yuborish
            await Verification.deleteOne({ userId });
            await Auth.findByIdAndDelete(userId);
            res.render('error', { message: "Afsuski amal qilish muddati tugadi, oldinroq kirish kerak edi. Yoki boshqatdan ro'yhatdan o'ting!" });
        }
        else {
            // todo: Aks holda uniqueId yordamida ma'lumotni asl ekanligi tekshiriladi, agar xatolik bo'lsa mos ravishda html sahifa qaytariladi
            const isValid = await bcrypt.compare(uniqueId, existingVerification.uniqueId);
            if (!isValid) return res.render('error', { message: "Verifikatsiya ma'lumotlari yaroqsiz, iltimos qayta tekshirib ko'ring!" });
            // todo: Agar shu yergacham yetib kelsa u holda foydalanuvchi ma'lumotlari o'zgartiriladi qaysiki verified: false => verified: true
            await Auth.findByIdAndUpdate(userId, { verified: true });
            // todo: So'ng verification model ma'lumotlari o'chirilib yuboriladi
            await Verification.deleteMany({ userId });
            res.render('verified', { message: "Verifikatsiya muvaffaqiyatli tugallandi, sahifani yopib, hisobingizga kiring" });
        }
    } catch (error) {
        console.log(error.message);
        res.render('error', { message: error.message });
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
    verificateUser,
};