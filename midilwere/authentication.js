const jwt = require('jsonwebtoken');

function authentication(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).send("Token mavjud emas!");
        }

        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
                console.error("JWT Verification Error:", err.message);
                return res.status(403).send("Yaroqsiz token!");
            }

            req.authId = decoded?.id;
            req.authRole = decoded?.role;
            next();
        });
    } catch (error) {
        console.error("Authentication Error:", error.message);
        res.status(500).send("Serverda xatolik yuz berdi");
    }
}

module.exports = authentication;
