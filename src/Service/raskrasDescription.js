const fs = require('fs');

class RaskrasDescription {
    readFile() {
        return new Promise((resolve, reject) => {
            fs.readFile('./desc.json', (error, data) => {
                if (error) reject(error);
                resolve(data);
            });
        });
    }

    async init() {
        this.data = JSON.parse(await this.readFile());
        console.log(`Init descriptions: ${this.data.length}`);
    }

    getData() {
        return this.data;
    }

}

module.exports = new RaskrasDescription();
