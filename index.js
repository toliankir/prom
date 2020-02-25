// const wget = require('node-wget');
// const j = require('j');
// const { parseString } = require('xml2js');
// const fs = require('fs');
const promClient = require('./prom');
const ostatki = require('./ostatki');
const axios = require('axios');

async function test() {
    await ostatki.download();
    const promGoods = await promClient.getAllGoods();
    const ostatkiGoods = await ostatki.getGoods();
    const diffGoods = [];
    const arr = [];
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
            // console.log(promEl.name);
            arr.push(promEl);
        }
    });
    // console.log(arr);
    const changedNames = changeNames(arr, [{
        from: 'КН ',
        to: 'KH'
    },
    {
        from: 'КН',
        to: 'KH'
    },
    {
        from: 'KH ',
        to: 'KH'
    },
    {
        from: 'PGX ',
        to: 'PGX'
    }]);

    await promClient.changeProductArray([diffGoods[0]]);
    console.log('---------------');
    await promClient.changeProductArray([{
        id: 1132107444,
        name: 'Тестова строка'
    }]);
    // console.log(diffGoods);
    // console.log(goods[0].id, goods[0].name, goods[0].presence, goods[0].price);
    // let count = 0;
    // while (count < diffGoods.length) {
    //     await promClient.changeProductArray(diffGoods.slice(count, count + 100));
    //     count += 100;
    // }
    // await promClient.changeProductStatus(goods[0].id);
}

function changeNames(products, changesArray) {
    const result = products.map(product => {
        let name = product.name;
        changesArray.forEach(el => {
            name = name.replace(el.from, el.to);
        });
        return {
            id: product.id,
            name
        }
    })
    return result;
}

test();
