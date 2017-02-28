module.exports = function (app) {
    app.get('/pagamentos', function (req, res) {
        console.log('Restornando a requisao pro cliente');
        res.send('Ok.')
    });
    app.get('/pagamentos/pagamento/:id',function(req,res){
        console.log('consultando pagamento');
                let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.PagamentoDao(connection);
        let id = req.params.id;
        pagamentoDao.buscaPorId(id,function(erro,resultado){
            if(erro){
                console.log(erro);
                res.status(500).send(erro);
                return;
            }
            console.log('Pagamento Encontrado:'+JSON.stringify(resultado));
            res.send(resultado);
            return;
        });

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

        req.assert("pagamento.forma_de_pagamento", "Forma de pagamento é obrigatorio").notEmpty();
        req.assert("pagamento.valor", "valor é obrigatorio e deve ser um decimal ").notEmpty().isFloat();

        let erros = req.validationErrors();

        if (erros) {
            console.log('Erros de validacao encontrados');
            res.status(400).send(erros);
            return;
        }

        console.log('processando uma requisicao de um pagamento.');
        let pagamento = req.body['pagamento'];
        pagamento.status = 'Criado';
        pagamento.data = new Date;

        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.PagamentoDao(connection);


        pagamentoDao.salva(pagamento, function (erro, resultado) {
            if (erro) {
                res.status(500).send(erro);
            } else {
                pagamento.id = resultado.insertId;
                console.log('Pagamento criado.');
                if (pagamento.forma_de_pagamento == 'cartao') {
                    let cartao = req.body['cartao'];

                    console.log(cartao);

                    let cartoesClient = new app.servicos.clienteCartoes();
                    cartoesClient.Autoriza(cartao,
                        function (erroCartao, requestCartao, responseCartao, retornoCartao) {
                            if (erroCartao) {
                                console.log(erroCartao);
                                res.status(400).send(erroCartao);
                                return;
                            }
                            console.log(retornoCartao);
                            res.location('pagamentos/pagamento/' +
                                pagamento.id
                            );
                            response = {
                                "dados_do_pagamento": pagamento,
                                "cartao":retornoCartao,
                                "links": [{
                                        href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                                        rel: "CONFIRMAR",
                                        method: "PUT"
                                    },
                                    {
                                        href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                                        rel: "CANCELAR",
                                        method: "DELETE"
                                    }
                                ]
                            }
                            res.status(200).send(response);
                            return;
                        })
                } else {
                    res.location('pagamentos/pagamento/' +
                        pagamento.id
                    );
                    response = {
                        "dados_do_pagamento": pagamento,
                        "links": [{
                                href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                                rel: "CONFIRMAR",
                                method: "PUT"
                            },
                            {
                                href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                                rel: "CANCELAR",
                                method: "DELETE"
                            }
                        ]
                    }
                    res.status(201).json(response);
                }


            }
        });

    });
}