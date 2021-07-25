const fs = require('fs');
const path = require('path');

module.exports = (caminho, nomeDoArquivo, callBackImagemCriada) => {

   const tiposValidos = ['.jpg', '.png', '.jpeg'];

   const tipo = path.extname(caminho);

   const isTipoValido = tiposValidos.indexOf(tipo) !== -1;

   if (!isTipoValido) {
      console.log('Tipo invalido!');
      const erro = "Tipo é inválido";
      callBackImagemCriada(erro);
   } else {
      const novoCaminho = `./assets/images/${nomeDoArquivo}${tipo}`

      fs.createReadStream(caminho)
         .pipe(fs.createWriteStream(novoCaminho))
         .on('finish', () => callBackImagemCriada(false, novoCaminho));
   }
}
