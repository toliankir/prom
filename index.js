// const wget = require('node-wget');
// const j = require('j');
// const { parseString } = require('xml2js');
// const fs = require('fs');

const promClient = require('./prom');
const raskras = require('./raskras');
const helpers = require('./productHelpers');

async function renameUntrackedRaskras() {
    const groupId = 36415834;

    await promClient.fetchAllGoods(groupId);
    const promProducts = promClient.getAllProducts();
    await raskras.decodeProducts();
    const untracked = raskras.getUntacketProducts(promProducts);
    const changedProducts = helpers.changeNamesRaskras(untracked, helpers.raskrasNamesConvert);
    promClient.changeProductArray(changedProducts);
}

async function changeRaskrasPresenceState() {
    const groupId = 36415834;

    await promClient.fetchAllGoods(groupId);
    const promProducts = promClient.getAllProducts();
    await raskras.decodeProducts();
    const changedPresence = raskras.getWithChangedPresence(promProducts);
    promClient.changeProductArray(changedPresence);
}

async function test() {
    await promClient.fetchAllGoods(36415834);
    // const promProducts = promClient.getAllProducts();
    // await raskras.decodeProducts();
    // const untracked = raskras.getUntacketProducts(promProducts);
    // console.log(untracked.length);
}

(async () => {
    // renameUntrackedRaskras();
    // test();
    // await raskras.download();
    changeRaskrasPresenceState();
})();
