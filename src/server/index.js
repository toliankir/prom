const http = require('http');
const server = require('./server');
const promClient = require('../Service/prom');
const raskrasOstatki = require('../Service/raskrasOstatki');
const raskrasDescription = require('../Service/raskrasDescription');

const PORT = 3000;

(async () => {
    //Група картины по номерам
    const groupId = 36415834;
    await promClient.fetchAllGoods(groupId);

    // await raskrasOstatki.download();
    await raskrasOstatki.decodeProducts();

    await raskrasDescription.init();

    http.createServer(server.listen(PORT, () => {
        console.log(`Server start on port ${PORT}`);
    }));
})();
