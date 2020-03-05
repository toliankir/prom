const j = require('j');

async function test() {
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
        const product = {};
        position = getProduct(product, modelArray, position, sheet);
        products.push(product);
    }
    console.log(products[9202]);
}


function getProduct(product, model, startPostiton, xls) {
    let postiotn = startPostiton;
    let codeReturn = false;

    for (item of model) {
      
        if (/^\d{6}$/.test(xls[postiotn].v)) {
            if (codeReturn) {
                return postiotn;
            }
            codeReturn = true;
        }

        if (item) {
            product[item] = xls[postiotn].v;
        }
        postiotn += 1;
    }

    while (postiotn < xls.length) {
        if (/^\d{6}$/.test(xls[postiotn].v)) {
            return postiotn;
        }
        postiotn += 1;
    }

    return -1;
}

(async () => {
    test();
})();
