class NaoEncontrado extends Error{
   constructor(){
      super('Fornecedor não foi Encontrado!');
      this.name = 'NaoEncontrado';
      this.idErro=0
   }
}

module.exports = NaoEncontrado;