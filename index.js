// const wget = require('node-wget');
// const j = require('j');
// const { parseString } = require('xml2js');
// const fs = require('fs');
const promClient = require('./prom');
const raskras = require('./raskras');
// const helpers = require('./productHelpers');

async function test() {
    await raskras.download();
    await promClient.fetchAllGoods();
    const promProducts = promClient.getAllProducts();
    await raskras.decodeProducts();
    // const untracked = raskras.getUntacketProducts(promProducts);
    const raskrasProd = raskras.getAllProducts();
    let count = 0;
    raskrasProd.forEach(el => {
        if (el.present) {
            count += 1;
        }
    });
    console.log(count);

    count = 0;
    promProducts.forEach(el => {
        if (el.presence === 'available') {
            count += 1;
        }
    });
    console.log(count);

    const untracked = raskras.getWithChangedPresence(promProducts);
    // const changedProducts = helpers.changeNames(untracked, helpers.raskrasNamesConvert);
    // console.log(untracked.length);
    promClient.changeProductArray(untracked);
    // console.log(untracked);

    // let p = await promClient.geyProductById(1132839420);
    // console.log(p.product);
    // console.log(p.product.name, p.product.presence);

    // await promClient.changeProductArray([{
    //     id: p.product.id,
    //     presence: 'not_available'
    // }]);

    // p = await promClient.geyProductById(1132839420);
    // console.log(p.product.presence);
}


test();
