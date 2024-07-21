const express = require('express');
const router = express.Router();
const {
    getAllBooksFunc,
    getOneBookFunc,
    createNewBookFunc,
    updateBookFunc,
    deleteBookFunc,
    getBooksByCategory
} = require('../controller/bookController');
const authentication = require('../midilwere/authentication');


// Barcha kitoblarni olishga mo'ljallangan route
router.get('/', getAllBooksFunc);
// Bitta kitobni olishga mo'ljallangan route
router.get('/:id', getOneBookFunc);
// Ma'lumotlar omboriga yangi kitob qo'shishga mo'ljallangan route
router.post('/', authentication, createNewBookFunc);
// Ma'lumotlar omboridagi mavjud kitobni yangilash
router.put('/:id', updateBookFunc);
// Ko'rsatilgan kitobni ma'lumotlar omboridan o'chirib yuborish
router.delete('/:id', deleteBookFunc);
router.get('/byCategory/:categoryId', getBooksByCategory);

// Routerni export qilish
module.exports = router;