require('dotenv').config();
const axios = require('axios');

const AUTH_TOKEN = process.env.PROM_API_KEY;
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

    async fetchAllGoods(group) {
        const allGoods = [];
        const requestCount = 100;
        let goods = await this.getGoods(group, 0, requestCount);
        allGoods.push(...goods);
        console.log(`Fetched: ${goods.length}`);

        while (goods.length === requestCount) {
            const lastId = allGoods[allGoods.length - 1].id;
            /* eslint-disable */
            goods = await this.getGoods(group, lastId, requestCount,);
            /* eslint-enable */
            console.log(`Fetched: ${goods.length}`);
            allGoods.push(...goods);
        }
        console.log(`Articles fetched: ${allGoods.length}`);
        this.products = allGoods;
    }

    getAllProducts() {
        return this.products;
    }

    async getGoods(group, from = 0, count = 5) {
        const { products } = await this.makeApiCall('GET', `/api/v1/products/list?limit=${count}&last_id=${from}&group_id=${group}`, null);
        return products;
    }

    async changeProductArray(array) {
        const sendCount = 50;
        let count = 0;
        // const promises = [];
        while (count < array.length) {
            /* eslint-disable */
            const data = await this.makeApiCall('POST', '/api/v1/products/edit', array.slice(count, count + sendCount));
            /* eslint-enable */
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
