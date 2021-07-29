const roteador = require('express').Router();
const TabelaFornecedor = require('./TabelaFornecedor');
const ModeloTabelaFornecedor = require('./TabelaFornecedor');

roteador.use('/', async (req, res) =>{
   const resultados = await TabelaFornecedor.listar();
   res.send(
      JSON.stringify(resultados)
   );   
});

module.exports = roteador;