const roteador = require('express').Router();
const TabelaFornecedor = require('./TabelaFornecedor');
const Fornecedor = require('./Fornecedor');
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor;

roteador.options('/', (req, res)=>{
   res.set('Access-Control-Allow-Methods', 'GET, POST');
   res.set('Access-Control-Allow-Headers', 'Content-Type');
   res.status(204);
   res.end();
});

roteador.options('/:idFornecedor', (req, res)=>{
   res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE');
   res.set('Access-Control-Allow-Headers', 'Content-Type');
   res.status(204);
   res.end();   
});


roteador.get('/', async (req, res) => {
   const resultados = await TabelaFornecedor.listar();
   const serializador = new SerializadorFornecedor(
      res.getHeader('Content-Type'),
      ['empresa']
   );
   res.status(200);
   res.send(
      serializador.serializar(resultados)
   );
});

roteador.get('/:idFornecedor', async (req, res, proximo) => {
   try {
      const id = req.params.idFornecedor;
      const fornecedor = new Fornecedor({ id: id })
      await fornecedor.carregar();
      res.status(200);
      const serializador = new SerializadorFornecedor(
         res.getHeader('Content-Type'),
         ['email', 'dataCriacao', 'dataAtualizacao', 'versao', 'empresa']
      );
      res.send(
         serializador.serializar(fornecedor)
      );
   } catch (erro) {
      proximo(erro);
   };
});

roteador.post('/', async (req, res, proximo) => {
   try {
      const dadosRecebidos = req.body;
      const fornecedor = new Fornecedor(dadosRecebidos);
      await fornecedor.criar();
      const serializador = new SerializadorFornecedor(
         res.getHeader('Content-Type'),
         ['empresa']
      );
      res.status(201);
      res.send(
         serializador.serializar(fornecedor)
      );
   } catch (erro) {
      proximo(erro);
   }
});

roteador.put('/:idFornecedor', async (req, res, proximo) => {
   try {
      const id = req.params.idFornecedor;
      const dadosRecebidos = req.body;
      const dados = Object.assign({}, dadosRecebidos, { id: id });
      const fornecedor = new Fornecedor(dados);
      await fornecedor.atualizar()
      res.status(204);
      res.end()
   } catch (erro) {
      proximo(erro);
   };
});

roteador.delete('/:idFornecedor', async (req, res, proximo) => {
   try {
      const id = req.params.idFornecedor;
      const fornecedor = new Fornecedor({ id: id });
      await fornecedor.carregar();
      await fornecedor.remover(id);
      res.status(204);
      res.end();
   } catch (erro) {
      proximo(erro);
   };
});

const roteadorProdutos = require('./produtos/index');

const verificarFornecedor = async (req, res, next) => {
   try {
      const id = req.params.idFornecedor;
      const fornecedor = new Fornecedor({ id: id });
      await fornecedor.carregar();
      req.fornecedor = fornecedor;
      next();
   } catch (erro) {
      next(erro);
   }
}

roteador.use('/:idFornecedor/produtos', verificarFornecedor, roteadorProdutos);

module.exports = roteador;