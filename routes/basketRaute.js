const express = require('express');
const router = express.Router();
const {
    addToBasketFunc,
    getBasketItems,
    removeFromBasketFunc,
    clearBaket
} = require('../controller/basketController');

// Berilgan kitobni foydalanuvchi savatiga joylash
router.post('/:userId/basket/:flowerId', addToBasketFunc);
router.post('/clearbasket', clearBaket);
router.get('/:userId/basket', getBasketItems);
router.delete('/:userId/remove/basket/:flowerId', removeFromBasketFunc);

// Routerni export qilish
module.exports = router;