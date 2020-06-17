const knex = require('../../db/knex');

/**
 * Returns the transformed data for all the datasets in the database.
 */
const datasets = async () => {
    try {
        const datasets = await knex.select().from('datasets');
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

module.exports = {
    datasets
};
