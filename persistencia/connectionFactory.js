var mysql = require('mysql');

function createDBConnection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'desenv',
        password: 'desenv@3377',
        database: 'payfast'
    });

}

 module.exports = function () {
        return createDBConnection;
    }