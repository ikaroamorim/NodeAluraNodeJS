const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();


const conexao = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT ,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: 'agenda-petshop' 
});

module.exports = conexao;