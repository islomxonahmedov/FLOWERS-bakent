const express = require('express');
const router = express.Router();
const {
    getAllFlowerssFunc,
    getOneFlowersFunc,
    createNewFlowersFunc,
    updateFlowersFunc,
    deleteFlowersFunc,
    getFlowerssByCategory
} = require('../controller/flowersController');
const authentication = require('../midilwere/authentication');
const upload = require('../config/milter');


// Barcha flowerslarni olishga mo'ljallangan route
router.get('/', getAllFlowerssFunc);
// Bitta flowersni olishga mo'ljallangan route
router.get('/:id', getOneFlowersFunc);
// Ma'lumotlar omboriga yangi flowers qo'shishga mo'ljallangan route
router.post('/', authentication, createNewFlowersFunc);
// Ma'lumotlar omboridagi mavjud flowersni yangilash
router.put('/:id', updateFlowersFunc);
// Ko'rsatilgan flowersni ma'lumotlar omboridan o'chirib yuborish
router.delete('/:id', deleteFlowersFunc);
router.get('/byCategory/:categoryId', getFlowerssByCategory);

// Routerni export qilish
module.exports = router;