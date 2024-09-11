const express = require('express');
const router = express.Router();
const {
    addToLikeFunc,
    getLikeItems,
    removeFromLikeFunc
} = require('../controller/likeController');

// Berilgan kitobni foydalanuvchi savatiga joylash
router.post('/:userId/like/:flowerId', addToLikeFunc);
router.get('/:userId/like', getLikeItems);
router.delete('/:userId/remove/like/:flowerId', removeFromLikeFunc);

// Routerni export qilish
module.exports = router;