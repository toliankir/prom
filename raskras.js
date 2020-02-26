const wget = require('node-wget');
const j = require('j');
// const fs = require('fs');

const FILE_NAME = 'https://www.dropbox.com/s/7orl61qn8vl2xy8/Ostatki_opt.xlsx?dl=1';

class Ostatki {
    constructor(link) {
        this.link = link;
        this.products = [];
    }

    async download() {
        return new Promise((res) => {
            wget(this.link, () => {
                res();
            });
        });
    }

    async decodeProducts() {
        const data = j.XLSX.readFile('./Ostatki_opt.xlsx');
        const sheet = Object.values(Object.values(data.Sheets)[0]);
        const productCode = 1;
        const productCost = 2;
        const productPresent = 5;
        const colsCount = 6;
        let currentCell = 7;
        const products = [];
        while (currentCell < sheet.length - (2 * colsCount)) {
            products.push({
                code: sheet[currentCell + productCode].v,
                cost: sheet[currentCell + productCost].v,
                present: sheet[currentCell + productPresent].v === '+'
            });
            currentCell += colsCount;
        }
        this.products = products;
    }

    getWithChangedPresence(products) {
        const changePresence = [];
        let add = 0;
        let remove = 0;
        products.forEach(inProduct => {
            const findedProduct = this.products.find((baseProduct) => {
                return inProduct.name.indexOf(baseProduct.code) !== -1;
            });
            if (findedProduct) {
                if (inProduct.presence === 'available' && !findedProduct.present) {
                    remove += 1;
                    changePresence.push({
                        id: inProduct.id,
                        name: inProduct.name,
                        presence: 'not_available',
                        quantity_in_stock: 0
                    });
                }
                if (inProduct.presence === 'not_available' && findedProduct.present) {
                    add += 1;
                    changePresence.push({
                        id: inProduct.id,
                        name: inProduct.name,
                        presence: 'available',
                        quantity_in_stock: 1
                    });
                }
            }
        });
        console.log(`Add products: ${add}, remove products ${remove}`);
        return changePresence;
    }

    getUntacketProducts(products) {
        const untrackedProducts = [];
        products.forEach(inProduct => {
            const findedProduct = this.products.find((baseProduct) => {
                return inProduct.name.indexOf(baseProduct.code) !== -1;
            });
            if (!findedProduct) {
                untrackedProducts.push(inProduct);
            }
        });
        return untrackedProducts;
    }

    getAllProducts() {
        return this.products;
    }
}

module.exports = new Ostatki(FILE_NAME);
