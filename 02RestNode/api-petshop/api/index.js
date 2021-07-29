const express = require('express');
const app = express();
const boryParser = require('body-parser');
const bodyParser = require('body-parser');
const config = require('config');
const roteador = require('./rotas/fornecedores');

app.use(express.json());


app.use('/api/fornecedores', roteador)


app.listen(config.get('api.porta'), ()=>{
   console.log('Api funcionando!!');
});