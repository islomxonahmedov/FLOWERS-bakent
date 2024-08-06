const express = require("express");
const upload = require("../config/milter");
const router = express.Router();

router.post("/", upload.array('images', 4), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No images uploaded!" });
    }
    const uploadedImages = req.files.map(file => `${process.env.SERVER_LINK}/${file.filename}`);
    res.status(200).json({ message: "Successfully uploaded!", imgUrls: uploadedImages });
});

module.exports = router;
