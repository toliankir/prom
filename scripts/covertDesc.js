const j = require('j');
const fs = require('fs');

function getProduct(model, startPostiton, xls) {
    let position = startPostiton;
    let codeReturn = false;
    const product = {};

    for (let item = 0; item < model.length; item += 1) {
        if (/^\d{6}$/.test(xls[position].v)) {
            if (codeReturn) {
                return {
                    offset: position,
                    product
                };
            }
            codeReturn = true;
        }

        if (model[item]) {
            product[model[item]] = xls[position].v;
        }
        position += 1;
    }

    while (position < xls.length) {
        if (/^\d{6}$/.test(xls[position].v)) {
            return {
                offset: position,
                product
            };
        }
        position += 1;
    }

    return {
        offset: -1,
        product
    };
}

async function decodeXls() {
    const modelArray = [
        'code',
        'size',
        null,
        'producer',
        'title',
        null,
        'priceOptUsd',
        'priceOptGrn',
        null,
        null,
        null,
        'roznica',
        null,
        'present',
        'desc',
        'dificult',
        'colors',
        null,
        'details',
        'box'];

    const data = j.XLS.readFile('./price-foto-paint.xls');
    const sheet = Object.values(Object.values(data.Sheets)[0]);

    const products = [];
    let position = 36;

    while (position !== -1) {
        const { product, offset } = getProduct(modelArray, position, sheet);
        position = offset;
        products.push(product);
    }
    return products;
}

(async () => {
    const products = await decodeXls();
    fs.writeFile('./desc.json', JSON.stringify(products), (err) => {
        if (err) console.log(err);
    });
})();
