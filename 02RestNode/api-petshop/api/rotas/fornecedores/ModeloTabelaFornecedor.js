const Sequelize = require('sequelize');
const instancia = require('../../banco-de-dados/index');

const conlunas = {
   empresa: {
      type: Sequelize.STRING,
      allowNull: false
   },
   email:{
      type: Sequelize.STRING,
      allowNull: false
   },
   categoria:{
      type: Sequelize.ENUM('ração', 'brinquedos'),
      allowNull: false
   }
}

const opcoes = {
   freezeTableName: true,
   freezeTableName: 'Fornecedores',
   timestamps: true,
   createdAt: 'dataCriacao',
   udatedAt: 'dataAtualização',
   version: 'versao'
}

module.exports = instancia.define('fornecedor', conlunas, opcoes)