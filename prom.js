const axios = require('axios');

const AUTH_TOKEN = 'eb23a26395026559668a736a602199a351ea92b3';
const HOST = 'https://my.prom.ua';

class PromService {
    constructor(token) {
        this.token = token;
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
            data});
            return response.data;
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
