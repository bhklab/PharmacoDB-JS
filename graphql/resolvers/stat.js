const knex = require('../../db/knex');

/**
 * @returns {Array} - an array of the object of total count for each data type with it's name.
 */
const data_type_stats = async () => { //TODO: UPDATE THIS BASED ON THE NEW DATABASE.
    try {
        const datasetCount = await knex('datasets').max('dataset_id as datasetCount');
        const compoundCount = await knex('drugs').max('drug_id as compoundCount');
        const cellCount = await knex('cells').max('cell_id as cellCount');
        const tissueCount = await knex('tissues').max('tissue_id as tissueCount');
        const experimentCount = await knex('experiments').max('experiment_id as experimentCount');
        // const geneCount = await knex('genes').max('gene_id as geneCount');

        return (
            [{
                dataType: 'dataset',
                count: datasetCount[0].datasetCount,
            }, {
                dataType: 'compound',
                count: compoundCount[0].compoundCount,
            }, {
                dataType: 'cell',
                count: cellCount[0].cellCount,
            }, {
                dataType: 'tissue',
                count: tissueCount[0].tissueCount,
            }, {
                dataType: 'experiment',
                count: experimentCount[0].experimentCount,
            }]
            // , {
            //     dataType: 'gene',
            //     count: geneCount[0].geneCount,
            // }
        );

    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = {
    data_type_stats,
};
