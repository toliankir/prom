// const csv = require('csv-parser');
// const fs = require('fs');
const glob = require('glob');
const promClient = require('../prom');
const raskras = require('../raskras');

// function readCsv(file) {
//     return new Promise((resolve, reject) => {
//         const result = [];
//         fs.createReadStream(file)
//             .pipe(csv())
//             .on('data', (data) => {
//                 result.push(data);
//             })
//             .on('end', () => {
//                 resolve(result);
//             })
//             .on('error', (error) => {
//                 reject(error);
//             });
//     });
// }
// function removeEmpty(obj) {
//     const newObj = { };
//     Object.keys(obj).forEach((key) => {
//         if (obj[key] !== '') {
//             newObj[key] = obj[key];
//         }
//     });
//     console.log(newObj);
// }

function codeInPromCatalog(code, promProducts) {
    return promProducts.some((promProduct) => promProduct.name.indexOf(code) > -1);
}

function getImageName(code) {
    return new Promise((resolve, reject) => {
        glob(`images/${code}.*`, (err, files) => {
            if (err) reject(err);
            resolve(files[0]);
        });
    });
}

async function getUntackedProducts() {
    const groupId = 36415834;
    await promClient.fetchAllGoods(groupId);
    const promProducts = promClient.getAllProducts();
    await raskras.decodeProducts();
    const raskrasPresentedProducts = raskras.getPresentedProducts();
    const productDiff = raskrasPresentedProducts.filter((raskrasProduct) => (
        !codeInPromCatalog(raskrasProduct.code, promProducts)));
    return productDiff;
}

async function getUntrackeForExport() {
    const untacked = await getUntackedProducts();
    const untrackedWithImage = [];
    for (const product of untacked) {
        const file = await getImageName(product.code);
        if (file) {
            untrackedWithImage.push(product);
        }
    }
    return untrackedWithImage;
//     // const data = await readCsv('export-products-02-03-20_21-06-18.csv');
//     // const test = { ...data[0] };
//     // console.log(test);
//     // removeEmpty(data[0]);
};

module.exports = {
    getUntrackeForExport
}
