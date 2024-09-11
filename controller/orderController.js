const Order = require('../model/ordersModel');
const Auth = require('../model/authModel');

// Foydalanuvchi statusini yangilash
const updateUserStatus = async (userId) => {
    try {
        // Foydalanuvchining buyurtmalarini olish
        const orders = await Order.find({ user: userId });

        // Mahsulot borligini tekshirish
        const hasProducts = orders.some(order => order.items.length > 0);

        // Foydalanuvchi statusini yangilash
        await Auth.findByIdAndUpdate(userId, {
            status: hasProducts ? 'Active' : 'Idle'
        });
    } catch (error) {
        console.error("Statusni yangilashda xato:", error);
    }
};

// Buyurtma qo'shish
const addOrder = async (req, res) => {
    const { userId, items, phoneNumber } = req.body;

    try {
        // Jami narxni hisoblash
        const totalPrice = items.reduce((total, item) => {
            return total + (item.flower.narxi * item.count);
        }, 0);

        // Oxirgi buyurtmani topish va buyurtma raqamini aniqlash
        const lastOrder = await Order.findOne().sort({ orderNumber: -1 });
        const orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1000; // Agar buyurtma bo'lmasa, 1000 dan boshlash

        // Yangi buyurtma yaratish
        const newOrder = new Order({
            user: userId,
            items: items,
            phoneNumber: phoneNumber,
            totalPrice: totalPrice,
            orderNumber: orderNumber,
        });

        await newOrder.save();

        // Foydalanuvchi statusini yangilash
        await updateUserStatus(userId);

        res.status(200).json({ message: 'Buyurtma muvaffaqiyatli yaratildi.' });
    } catch (error) {
        console.error('Buyurtma yaratishda xatolik yuz berdi:', error);
        res.status(500).json({ message: 'Buyurtma yaratishda xatolik yuz berdi.' });
    }
};

// Foydalanuvchi buyurtmalarini olish
const getOrdersByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const orders = await Order.find({ user: userId }).populate('items.flower');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Buyurtmalarni olishda xatolik yuz berdi.' });
    }
};

// Barcha buyurtmalarni olish
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate({ path: 'items.flower' });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ message: 'Failed to retrieve orders' });
    }
};

// Buyurtma statusini yangilash
const updateStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!order) return res.status(404).send('Buyurtma topilmadi');
        
        // Foydalanuvchi statusini yangilash
        await updateUserStatus(order.user);

        res.send(order);
    } catch (error) {
        res.status(500).send('Server xatosi');
    }
};

module.exports = {
    addOrder,
    getOrdersByUser,
    getAllOrders,
    updateStatus,
    updateUserStatus
};
