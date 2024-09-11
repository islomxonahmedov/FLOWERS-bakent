module.exports = function (app) {
    app.get('/', (_, res) => res.send("Hello World!"));
    app.use('/api/auth', require('../routes/authraute'));
    app.use('/api/flowers', require('../routes/flowersRaote'));
    app.use('/api/catigory', require('../routes/catigoryRaut'));
    app.use('/api/upload-image', require('../routes/imgRaute'));
    app.use('/api/orders', require('../routes/orderRaute')); 
    app.use('/api', require('../routes/basketRaute'));
    app.use('/api', require('../routes/likeRaute'));
    app.use('/api/carousel', require('../controller/caruselController'));
};