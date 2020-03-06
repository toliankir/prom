// const csv = require('csv-parser');
// const fs = require('fs');
const fs = require('fs');
const path = require('path');
const promClient = require('../Service/prom');
const raskras = require('../Service/raskrasOstatki');
const descriptionService = require('../Service/raskrasDescription');

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

function getImagesArray(dir) {
    const dirPath = path.join(process.cwd(), dir);
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, (err, files) => {
            if (err) {
                reject(err);
            }
            resolve(files);
        })
    });
    
}

function getUntackedProducts() {
    const promProducts = promClient.getAllProducts();
    const raskrasPresentedProducts = raskras.getPresentedProducts();
    const productDiff = raskrasPresentedProducts.filter((raskrasProduct) => (
        !codeInPromCatalog(raskrasProduct.code, promProducts)));
    return productDiff;
}

async function getUntrackeForExport() {
    const filesArray = await getImagesArray('images');
    console.log(filesArray);
    const untacked = getUntackedProducts();
    const untrackedWithImage = [];
    const desc = descriptionService.getData();
    for (let product = 0; product < untacked.length; product += 1) {
        const more = desc.find(el => el.code == untacked[product].articul);
        const file = filesArray.find(file => file.split('.')[0] === untacked[product].code);

        if (file) {
            untrackedWithImage.push({
                ...untacked[product],
                more
            });
        }
    }
    return untrackedWithImage;
}

module.exports = {
    getUntrackeForExport
};
