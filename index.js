// const wget = require('node-wget');
// const j = require('j');
// const { parseString } = require('xml2js');
// const fs = require('fs');
const promClient = require('./prom');
const ostatki = require('./ostatki');

async function test() {
    // await ostatki.download();
    const promGoods = await promClient.getAllGoods();
    const ostatkiGoods = await ostatki.getGoods();
    const diffGoods = [];
    let arr = [];
    promGoods.forEach((promEl) => {
        const fromOst = ostatkiGoods.find(ostEl => promEl.name.indexOf(ostEl.code) !== -1);
        if (fromOst) {
            if (promEl.presence === 'available' && !fromOst.present) {
                diffGoods.push({
                    id: promEl.id,
                    presence: 'not_available'
                });
            }
            if (promEl.presence === 'not_available' && fromOst.present) {
                diffGoods.push({
                    id: promEl.id,
                    presence: 'available'
                });
            }
        } else {
            arr.push({
                id: promEl.id,
                name: promEl.name
            });
            console.log(promEl.name);
        }
    });
    // console.log(diffGoods);
    // console.log(goods[0].id, goods[0].name, goods[0].presence, goods[0].price);
    // let count = 0;
    // while (count < diffGoods.length) {
    //     await promClient.changeProductArray(diffGoods.slice(count, count + 100));
    //     count += 100;
    // }
    // await promClient.changeProductStatus(goods[0].id);
    arr = arr.map(el => {
        return {
            id: el.id,
            name: el.name.toString().replace('KН', 'KH')
        };
    });
    // console.log(arr);
    await promClient.changeProductArray(arr);

    // let count = 0;
    // while (count < arr.length) {
    //     await promClient.changeProductArray(arr.slice(count, count + 100));
    //     count += 100;
    // }
}

test();
