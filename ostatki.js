const wget = require('node-wget');
const j = require('j');
// const fs = require('fs');

const FILE_NAME = 'https://www.dropbox.com/s/7orl61qn8vl2xy8/Ostatki_opt.xlsx?dl=1';

class Ostatki {
    constructor(link) {
        this.link = link;
    }

    async download() {
        return new Promise((res) => {
            wget(this.link, () => {
                res();
            });
        });
    }

    async getGoods() {
        console.log(this.link);
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
                code: sheet[currentCell + productCode]['v'],
                cost: sheet[currentCell + productCost].v,
                present: sheet[currentCell + productPresent].v === '+'
            });
            currentCell += colsCount;
        }
        return products;
    }
}

module.exports = new Ostatki(FILE_NAME);
