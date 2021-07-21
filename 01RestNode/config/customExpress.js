const express = require('express');
const consign = require('consign');
//const bodyParser = require('body-parser');
//const { urlencoded } = require('body-parser');

module.exports = () => {
    const app = express();

    /**
     * Utilizando o body parser dava como deprecated
     */
    //app.use(bodyParser.urlencoded({ extended: true }));
    //app.use(bodyParser.json());

    app.use(express.urlencoded({extended: true}));
    app.use(express.json());

    consign({ locale: 'pt-br'}).include("controllers").into(app);

    return app
}
