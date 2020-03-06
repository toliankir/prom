const express = require('express');
const { getUntrackeForExport } = require('./test');

const app = express();

app.set('view engine', 'ejs');
app.use('/images', express.static('./images'));

app.get('/', async (req, res) => {
    const data = await getUntrackeForExport();
    res.render('products', { data });
});

module.exports = app;
