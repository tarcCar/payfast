function PagamentoDao(connection) {
    this._connection = connection;
}

PagamentoDao.prototype.salva = function (pagamento, callback) {
    this._connection.query('INSERT INTO pagamento SET ?', pagamento, callback);
}
PagamentoDao.prototype.atualiza = function (pagamento, callback) {
    this._connection.query('UPDATE  pagamento SET status = ? where id=?', [pagamento.status,pagamento.id], callback);
}

PagamentoDao.prototype.lista = function (callback) {
    this._connection.query('SELECT * FROM pagamento ', callback)
}
PagamentoDao.prototype.buscaPorId = function (Id, callback) {
    this._connection.query('SELECT * FROM pagamento WHERE ID = ?', [Id], callback)
}

module.exports = function(){
    return PagamentoDao;
}
