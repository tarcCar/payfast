var fs = require('fs');

fs.readFile('kiwi.jpg',function(erro,buffer){
    console.log('Arquivo Lido');

    fs.writeFile('kiwi2.jpg',buffer,function(erro){
        console.log('Arquivo escrito')
    })
})