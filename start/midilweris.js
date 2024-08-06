const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

module.exports = function (app) {
    // ! Middleware
    app.use(express.json());

    // ! Built in middleware
    app.use(express.static('public'));
    app.use(express.static('uploads'));
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
    app.use('/caruselImg', express.static(path.join(__dirname, '../caruselImg')));

    // ! Third party middleware
    app.use(helmet());
    if (app.get('env') === 'development') {
        app.use(cors());
    }

    // ! View engine
    app.set('view engine', 'ejs');
};
