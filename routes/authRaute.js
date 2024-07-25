const express = require("express");
const {
    signUpFunction,
    signInFunction,
    getAuth,
    verificateUser,
} = require("../controller/authContoroller");
const authentication = require("../midilwere/authentication");
const router = express.Router();

router.post("/signup", signUpFunction);
router.post("/signin", signInFunction);
router.get("/", authentication, getAuth);
module.exports = router;