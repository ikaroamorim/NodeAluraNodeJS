const conexao = require('../infraestrutura/conexao');
const moment = require('moment');

class Atendimento {

    adiciona(atendimento, res) {
        const sql = "INSERT INTO atendimentos SET ?";

        const dataCriacao = new moment().format('YYYY-MM-DD HH:MM:SS');
        const data = moment(atendimento.data, 'DD/MM/AAAA').format('YYYY-MM-DD HH:MM:SS');

        const isDataValid = moment(data).isSameOrAfter(dataCriacao);
        const isClienteValid = atendimento.cliente.length >= 5;

        const validacoes = [
            {
                nome: 'data',
                valido: isDataValid,
                mensagem: 'Data deve ser maior ou igual a atual'
            },
            {
                nome: 'cliente',
                valido: isClienteValid,
                mensagem: 'Cliente deve ter ao menos 5 caracteres'
            }
        ];

        const erros = validacoes.filter(campo => !campo.valido);
        const existeErros = erros.length;

        if (existeErros) {
            res.status(400).json(erros);
        } else {

            const atendimentoDatado = {
                ...atendimento,
                data,
                dataCriacao
            }

            conexao.query(sql, atendimentoDatado, (erro, resultados) => {
                if (erro) {
                    res.status(400).json(erro);
                } else {
                    res.status(201).json(resultados);
                }
            })
        }

    }

    lista(res) {
        const sql = 'SELECT * FROM Atendimentos';

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json(resultados);
            }
        });
    }

    buscaPorId(res, id) {
        const sql = `SELECT * FROM  Atendimentos WHERE id=${id}`

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json(resultados[0]);
            }
        });
    }

    altera(id, valores, res){
        if(valores.data){
            valores.data = moment(valores.data, 'DD/MM/AAAA').format('YYYY-MM-DD HH:MM:SS');
        }
        const sql = 'UPDATE Atendimentos SET ? WHERE id=?';
        
        conexao.query(sql, [valores,id], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json(resultados);
            }
        });
    }

    
}

module.exports = new Atendimento