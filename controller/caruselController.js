// routes/carousel.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const CarouselImage = require('../model/caruselModel');

const ensureUploadsFolder = () => {
    const dir = path.join(__dirname, '../caruselImg');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        ensureUploadsFolder();
        cb(null, 'caruselImg/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const url = `${req.protocol}://${req.get('host')}/caruselImg/${req.file.filename}`;
        const newImage = new CarouselImage({
            url,
            caption: req.body.caption
        });
        await newImage.save();
        res.status(201).json(newImage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const images = await CarouselImage.find();
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const image = await CarouselImage.findById(req.params.id);
        if (image) {
            const filePath = path.join(__dirname, '../caruselImg', path.basename(image.url));
            fs.unlinkSync(filePath); // Faylni o'chirish
            await CarouselImage.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Rasm o\'chirildi' });
        } else {
            res.status(404).json({ message: 'Rasm topilmadi' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;
