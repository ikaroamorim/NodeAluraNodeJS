class NaoEncontrado extends Error{
   constructor( nome){
      super(`${nome} não foi Encontrado!`);
      this.name = 'NaoEncontrado';
      this.idErro=0
   }
}

module.exports = NaoEncontrado;