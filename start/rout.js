module.exports = function (app) {
    app.get('/', (_, res) => res.send("Hello World!"));
    app.use('/api/auth', require('../routes/authraute'));
    app.use('/api/flowers', require('../routes/bookRaote'));
    app.use('/api/catigory', require('../routes/catigoryRaut'));
};