const knex = require('../../db/knex');

/**
 * Returns the transformed data for all the datasets in the database.
 */
const datasets = async () => {
    try {
        const datasets = await knex.select().from('datasets');
        const cell_count = await knex
            .select('source_name')
            .countDistinct('cell_id as cell_count')
            .from('source_cell_names as sc')
            .join('sources as s', 's.source_id', 'sc.source_id')
            .groupBy('sc.source_id');

        return datasets.map(dataset => {
            return {
                id: dataset.dataset_id,
                name: dataset.dataset_name
            };
        });
    } catch (err) {
        console.log(err);
        throw err;
    }
};

const dataset = async args => {
    try {
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = {
    datasets
};
