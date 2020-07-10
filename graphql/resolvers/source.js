const knex = require('../../db/knex');

/**
 * @returns {Object} - returns the data for all the sources.
 */
const sourceQuery = () => {
    return knex.select()
        .from('sources as s')
        .join('datasets as d', 's.dataset_id', 'd.dataset_id');
};

/**
 * @returns {Object} - transformed object for sources.
 */
const sources = async () => {
    const sources = await sourceQuery();
    // return the transformed data/object.
    return sources.map(source => {
        const {source_id, source_name, dataset_id, dataset_name} = source;
        return {
            id: source_id,
            name: source_name,
            dataset: {
                id: dataset_id,
                name: dataset_name
            }
        };
    });
};

module.exports = {
    sources
};