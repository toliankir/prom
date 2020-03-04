function onListening() {
    const addr = this.address();
    const bindPort = typeof addr === 'string' ? addr : `port ${addr.port}`;
    console.log(bindPort);
}

function bind(Server, port) {
    Server.on('listening', )
}