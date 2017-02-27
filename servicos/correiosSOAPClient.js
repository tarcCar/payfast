var soap = require('soap');

function CorreiosSOAPClient() {
    this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
}

CorreiosSOAPClient.prototype.calculaPrazo = function (args, callback) {
    soap.createClient(this._url, function (erro, cliente) {
        if (erro) {
            console.log(erro);
            return;
        }
        console.log('Cliente SOAP Criado');
        cliente.CalcPrazo(args, callback);
    });
}

module.exports = function () {
    return CorreiosSOAPClient;
}