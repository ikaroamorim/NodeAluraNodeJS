const conexao = require('../infraestrutura/database/conexao');
const moment = require('moment');
const axios = require('axios');
const repositorio = require('../repositories/atendimento');

class Atendimento {
    constructor() {
        this.isDataValid = ({ data, dataCriacao }) => moment(data).isSameOrAfter(dataCriacao);
        this.isClienteValid = ({ tamanho }) => tamanho >= 5;

        this.valida = (parametros) => {
            return this.validacoes.filter(campo => {
                const { nome } = campo;
                const parametro = parametros[nome];

                return !campo.valido(parametro);
            });
        }

        this.validacoes = [
            {
                nome: 'data',
                valido: this.isDataValid,
                mensagem: 'Data deve ser maior ou igual a atual'
            },
            {
                nome: 'cliente',
                valido: this.isClienteValid,
                mensagem: 'Cliente deve ter ao menos 5 caracteres'
            }
        ];
    }


    adiciona(atendimento) {
        const dataCriacao = new moment().format('YYYY-MM-DD HH:MM:SS');
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');

        const parametros = {
            data: { data, dataCriacao },
            cliente: { tamanho: atendimento.cliente.length }
        }
        const erros = this.valida(parametros);
        const existeErros = erros.length;

        if (existeErros) {
            return new Promise((resolve, reject) => reject(erros))
        } else {
            const atendimentoDatado = {
                ...atendimento,
                data,
                dataCriacao
            }

            return repositorio.adiciona(atendimentoDatado)
                .then((resultados) => {
                    const id = resultados.insertId;
                    return { ...atendimento, id }
                });

        }

    }

    lista() {
        return repositorio.lista();
    }

    buscaPorId(id, res) {
        const sql = `SELECT * FROM Atendimentos WHERE id=${id}`

        conexao.query(sql, async (erro, resultados) => {
            const atendimento = resultados[0]
            const cpf = atendimento.cliente
            if (erro) {
                res.status(400).json(erro)
            } else {
                const { data } = await axios.get(`http://localhost:8082/${cpf}`)

                atendimento.cliente = data

                res.status(200).json(atendimento)
            }
        })
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