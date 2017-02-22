module.exports = function (app) {
    app.get('/pagamentos', function (req, res) {
        console.log('Restornando a requisao pro cliente');
        res.send('Ok.')
    });

}