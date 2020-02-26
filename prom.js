const axios = require('axios');

const AUTH_TOKEN = 'eb23a26395026559668a736a602199a351ea92b3';
const HOST = 'https://my.prom.ua';

class PromService {
    constructor(token) {
        this.token = token;
        this.products = [];
    }

    async makeApiCall(method, url, data) {
        const response = await axios({
            method,
            baseURL: HOST,
            url,
            headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            data
        });
        return response.data;
    }

    async fetchAllGoods() {
        const allGoods = [];
        const requestCount = 100;
        let goods = await this.getGoods(0, requestCount);
        allGoods.push(...goods);

        while (goods.length !== 0) {
            const lastId = allGoods[allGoods.length - 1].id;
            /* eslint-disable */
            goods = await this.getGoods(lastId, requestCount);
            /* eslint-enable */
            allGoods.push(...goods);
        }
        this.products = allGoods;
    }

    getAllProducts() {
        return this.products;
    }

    async getGoods(from = 0, count = 5) {
        const { products } = await this.makeApiCall('GET', `/api/v1/products/list?limit=${count}&last_id=${from}`, null);
        return products;
    }

    async changeProductArray(array) {
        const sendCount = 50;
        let count = 0;
        // const promises = [];
        while (count < array.length) {
            const data = await this.makeApiCall('POST', '/api/v1/products/edit', array.slice(count, count + sendCount));
            console.log(data);
            count += sendCount;
        }
        // Promise.all(promises);
    }

    async geyProductById(id) {
        const product = await this.makeApiCall('GET', `/api/v1/products/${id}`, null);
        return product;
    }
}

module.exports = new PromService(AUTH_TOKEN);
