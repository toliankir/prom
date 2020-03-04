const http = require('http');
const server = require('./server');

http.createServer(server.listen(3000, () => {
    console.log('Server start');
}));