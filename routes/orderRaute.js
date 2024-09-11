const express = require('express');
const router = express.Router();
const { 
    addOrder,
    getOrdersByUser,
    getAllOrders,
    updateStatus
 } = require('../controller/orderController');
const authentication = require('../midilwere/authentication');

router.post('/add', authentication, addOrder); 
router.get('/all', getAllOrders);
router.get('/:userId', getOrdersByUser);
router.put('/:id/status', updateStatus);


// Routerni export qilish
module.exports = router;