const http = require('http');
const server = require('./server');
const promClient = require('../prom');
const raskras = require('../raskras');
const descriptionService = require('../descriptionService');


http.createServer(server.listen(3000, () => {
    console.log('Server start');
}));

(async () => {
    const groupId = 36415834;
    await promClient.fetchAllGoods(groupId);
    await raskras.decodeProducts();
    await descriptionService.init();
})();
