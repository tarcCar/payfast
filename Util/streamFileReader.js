var fs = require('fs');

fs.createReadStream('kiwi.jpg')
    .pipe(fs.createWriteStream('kiwi-com-stream.jpg'))
    .on('finish',function(){
        console.log('Aquivo escrito com o stream!');
    })