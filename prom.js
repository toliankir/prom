const https = require('https');


const AUTH_TOKEN = 'eb23a26395026559668a736a602199a351ea92b3';
const HOST = 'my.prom.ua';
const PORT = 443;

class PromService {
    constructor(token) {
        this.token = token;
    }

    makeApiCall(method, url, body) {
        return new Promise((resolve, reject) => {
            let options = {
                hostname: HOST,
                port: PORT,
                path: url,
                method: method,
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            };

            let bodyData = '';
            if (body) {
                bodyData = JSON.stringify(body);
                options.headers['Content-Length'] = bodyData.length;
            }

            const req = https.request(options, (res) => {
                let result = '';

                res.setEncoding('utf8');

                res.on('data', (chunk) => {
                    result += chunk;
                });

                res.on('end', () => {
                    resolve(JSON.parse(result));
                });
            });

            req.on('error', (e) => {
                reject(e);
            });

            req.write(bodyData);
            req.end();
        });
    }

    async getAllGoods() {
        const allGoods = [];
        const requestCount = 50;
        let goods = await this.getGoods(0, requestCount);
        allGoods.push(...goods);

        while (goods.length !== 0) {
            const lastId = allGoods[allGoods.length - 1].id;
            goods = await this.getGoods(lastId, requestCount);
            allGoods.push(...goods);
        }
        return allGoods;
    }

    async getGoods(from = 0, count = 5) {
        const { products } = await this.makeApiCall('GET', `/api/v1/products/list?limit=${count}&last_id=${from}`, null);
        return products;
    }

    async changeProductStatus(id) {
        const response = await this.makeApiCall('POST', '/api/v1/products/edit', [{
            id,
            presence: 'available',
            price: 100
        }]);
        console.log(response);
    }

    async changeProductArray(array) {
        console.log(array);
        const response = await this.makeApiCall('POST', '/api/v1/products/edit', array);
        console.log(response);
    }
}

module.exports = new PromService(AUTH_TOKEN);
