module.exports = app => {
    app.get('/atendimentos', (req, res) => {
        console.log("Get Atendimentos Recebido");
        res.send('Servidor rodando, tudo OK');
    });

    app.post('/atendimentos', (req, res) => {
        console.log("Requisição: ");
        console.log(req.body);
        res.send('Você está na rota de atendimento enviando POST')
    });
}