const knex = require('../../db/knex');

const getGenesBasedOnSymbol = (symbol) => knex.select('gene.id', 'symbol as value')
    .from('gene')
    .join('gene_annotation', 'gene.id', 'gene_annotation.gene_id')
    .where('symbol', 'like', `%${symbol}%`);

const addTypeField = (data, type) => data.map(el => ({...el, type}));


const search = async ({ input }) => {
    console.log('hahahaha', input);
    const genes = addTypeField(await getGenesBasedOnSymbol(input), 'gene');

    return (genes);
};

module.exports = {
    search,
};
