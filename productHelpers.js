const changeNamesRaskras = (products, changesArray) => {
    const result = products.map(product => {
        let name = product.name;
        changesArray.forEach(el => {
            name = name.replace(el.from, el.to);
        });
        return {
            id: product.id,
            name
        };
    });
    return result;
};

const raskrasNamesConvert = [{
    from: 'KНО',
    to: 'KHO'
},
{
    from: 'KHО ',
    to: 'KHO'
},
{
    from: 'КН ',
    to: 'KH'
},
{
    from: 'КН',
    to: 'KH'
},
{
    from: 'KH ',
    to: 'KH'
},
{
    from: 'PGX ',
    to: 'PGX'
},
{
    from: 'BRM ',
    to: 'BRM'
},
{
    from: 'ВК-',
    to: 'BK-GX'
},
{
    from: 'KHO ',
    to: 'KHO'
},
{
    from: 'Q',
    to: 'MR-Q'
},
{
    from: 'KН',
    to: 'KH'
},
{
    from: 'РХ',
    to: 'PX'
}
];

module.exports = {
    changeNamesRaskras,
    raskrasNamesConvert
};
