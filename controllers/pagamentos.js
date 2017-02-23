module.exports = function (app) {
    app.get('/pagamentos', function (req, res) {
        console.log('Restornando a requisao pro cliente');
        res.send('Ok.')
    });
    app.post('/pagamentos/pagamento', function (req, res) {
        if(req.body)
        {
            console.log('processando uma requisicao de um pagamento.');
            let pagamento = req.body;
            pagamento.status = 'Criado';
            pagamento.data = new Date;
            res.send(pagamento)
        }
    });
}