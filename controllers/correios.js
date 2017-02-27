module.exports = function(app){

     app.post('/correios/calcula-prazo',function(req,res){

        let dados_da_entrega = req.body;

        let correiosSOAP = new app.servicos.correiosSOAPClient();
        
        correiosSOAP.calculaPrazo(dados_da_entrega,function(erro,resultado){
            if(erro){
                console.log(erro);
                res.status(400).send(erro);
                return;
            }
            console.log('consultando prazo da entrega');
            res.status(200).send(resultado);
        })
     });   
}