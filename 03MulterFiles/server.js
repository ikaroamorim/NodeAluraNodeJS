const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');

/**
 * Primeira utilização do multer, cria arquivos sem extensão e hash como nome
 * 
 * const upload = multer({ dest: 'uploads/' });
 */

/**
 * Segunda versão, utilizando o fielName que vem do formulário
 * 
 * const storage = multer.diskStorage({
   destination: function (req, file, cb) {

       // error first callback
       cb(null, 'uploads/');
   },
   filename: function (req, file, cb) {

       // error first callback
       cb(null, file.fieldname + '-' + Date.now())
   }
});

const upload = multer({ storage });

 */


/**
 * Terceira implementação, utilizando o mesmo formato do documento de origem
 
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
       cb(null, 'uploads/')
   },
   filename: function (req, file, cb) {
       cb(null, `${file.fieldname}-${Date.now()}.${path.extname(file.originalname)}`);
   }
});

const upload = multer({ storage });
*/

/**
 * Quarta implementação, utilizando o nome original do arquivo
 */
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
       cb(null, 'uploads/')
   },
   filename: function (req, file, cb) {
       cb(null, file.originalname);
   }
});

const upload = multer({ storage });

 

app.use(express.static('public'));

app.post('/file/upload', upload.single('file'), 
    (req, res) => res.send('<h2>Upload realizado com sucesso</h2>')); 

app.listen(3000, () => console.log('App na porta 3000'));