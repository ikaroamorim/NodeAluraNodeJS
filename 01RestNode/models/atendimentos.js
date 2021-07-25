const conexao = require('../infraestrutura/conexao');
const moment = require('moment');
const axios = require('axios');

class Atendimento {

    adiciona(atendimento, res) {
        const sql = "INSERT INTO atendimentos SET ?";

        const dataCriacao = new moment().format('YYYY-MM-DD HH:MM:SS');
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');

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
                    res.status(201).json({ ...atendimento, ...resultados });
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

        

        conexao.query(sql, async (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                const atendimento = resultados[0];

                const cpf = atendimento.cliente;

                const { data } = await axios.get(`http://localhost:8082/${cpf}`);

                atendimento.cliente = data;

                res.status(200).json(atendimento);
            }
        });
    }

    altera(id, valores, res) {
        if (valores.data) {
            valores.data = moment(valores.data, 'DD/MM/AAAA').format('YYYY-MM-DD HH:MM:SS');
        }
        const sql = 'UPDATE Atendimentos SET ? WHERE id=?';

        conexao.query(sql, [valores, id], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json({ ...valores, id });
            }
        });
    }

    deleta(id, res) {
        const sql = 'DELETE FROM Atendimentos WHERE id=?'

        conexao.query(sql, id, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json({ id });
            }
        });
    }
}

module.exports = new Atendimento