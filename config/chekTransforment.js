const transporter = require("./transporint");

module.exports = function () {
    transporter.verify((error, success) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Xabar jo'natishga tayyor!");
            console.log(success);
        }
    });
};