module.exports = function (app) {
    app.get('/pagamentos', function (req, res) {
        console.log('Restornando a requisao pro cliente');
        res.send('Ok.')
    });
    app.delete('/pagamentos/pagamento/:id', function (req, res) {

        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.PagamentoDao(connection);

        let id = req.params.id;
        let pagamento = {};
        pagamento.id = id;
        pagamento.status = 'CANCELADO';

        pagamentoDao.atualiza(pagamento, function (erro) {
            if (erro) {
                res.status(500).send(erro);
                return;
            }
            res.status(204).send(pagamento)
        });


    });
    app.put('/pagamentos/pagamento/:id', function (req, res) {

        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.PagamentoDao(connection);

        let id = req.params.id;
        let pagamento = {};
        pagamento.id = id;
        pagamento.status = 'CONFIRMADO';

        pagamentoDao.atualiza(pagamento, function (erro) {
            if (erro) {
                res.status(500).send(erro);
                return;
            }
            res.send(pagamento)
        });


    });
    app.post('/pagamentos/pagamento', function (req, res) {

        req.assert("forma_de_pagamento", "Forma de pagamento é obrigatorio").notEmpty();
        req.assert("valor", "valor é obrigatorio e deve ser um decimal ").notEmpty().isFloat();

        var erros = req.validationErrors();

        if (erros) {
            console.log('Erros de validacao encontrados');
            res.status(400).send(erros);
            return;
        }

        console.log('processando uma requisicao de um pagamento.');
        let pagamento = req.body;
        pagamento.status = 'Criado';
        pagamento.data = new Date;

        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.salva(pagamento, function (erro, resultado) {
            if (erro) {
                res.status(500).send(erro);
            } else {
                pagamento.id = resultado.insertId;
                console.log('Pagamento criado.');
                res.location('pagamentos/pagamento/' +
                    pagamento.id
                );
                response = {
                    "dados_do_pagamento": pagamento,
                    "links": [{
                            href: "http://localhost:3000/pagamentos/pagamento/"+pagamento.id,
                            rel: "CONFIRMAR",
                            method: "PUT"
                        },
                        {
                            href: "http://localhost:3000/pagamentos/pagamento/"+pagamento.id,
                            rel: "CANCELAR",
                            method: "DELETE"
                        }
                    ]
                }
                res.status(201).json(response);

            }
        })

    });
}