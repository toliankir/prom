const express = require('express');
const { getUntrackeForExport } = require('./test');


const app = express();

app.set('view engine', 'ejs');
app.use('/images', express.static('./images'));

app.get('/favicon.ico', (req, res) => {
    console.log(123);
});

app.get('/test', (req, res) => {
    console.log(req.originalUrl);
    res.send('Ok');
});

app.get('/', async (req, res) => {
    const data = await getUntrackeForExport();
    console.log(data);
    res.render('products', { data });
});

module.exports = app;
