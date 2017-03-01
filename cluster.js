var cluster = require('cluster');
var os = require('os');

console.log('Executando a thread');
var cpus = os.cpus();

if (cluster.isMaster) {
    console.log('Thread master');
    cpus.forEach(function () {
        cluster.fork();
    })

    cluster.on('listening',worker => {
        console.log('Cluster Conectado: %d',worker.process.pid)
    })

    cluster.on('exit',worker => {
         console.log('Cluster Desconectado: %d',worker.process.pid);
         cluster.fork();
    })
} else {
    console.log('Thread slave');
    require('./index.js');
}