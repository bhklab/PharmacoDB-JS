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
 * 
 * @returns {Object}
 */
// TODO: Using dataset_id right now, might have to change in future.
const sourceStatQuery = () => {
    return knex.select()
        .from('source_statistics as st')
        .join('datasets as d', 'd.dataset_id', 'st.dataset_id');
};


/**
 * @param {String} - takes an argument either 'compound', 'tissue' or 'cell'
 * @returns {Object} - return object {source: {count: Number, source: String}, ....}
 */
const typeCountGroupBySource = async type => {
    // return object.
    const returnObject = {};
    /**
     * queries the database to get the data in the required format.
     * number of give type total across datasets
     * @returns {count: Number, source: String}
     */
    const query = await knex
        .select('source_name as source')
        .countDistinct(`${type}_id as count`)
        .from(`source_${type}_names as sn`)
        .join('sources as s', 's.source_id', 'sn.source_id')
        .groupBy('sn.source_id');
    // return object source_name: {count: Number, source: String}
    query.forEach(value => {
        const {
            source,
            count
        } = value;
        returnObject[source] = {
            source: source,
            count: count
        };
    });
    // return the transformed object.
    return returnObject;
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


/**
 * @returns {Object}
 */
// TODO: Need to confirm whether to use source stats or dataset stats.
// NOTE: This table stores the static data type count.
const source_stats = async () => {
    const stats = await sourceStatQuery();
    // return object.
    return stats.map(stat => {
        const {dataset_name, dataset_id, cell_lines, drugs, tissues, experiments} = stat;
        return {
            source_id: dataset_id,
            source_name: dataset_name,
            cell_line_count: cell_lines,
            tissue_count: tissues,
            compound_count: drugs,
            experiment_count: experiments
        };
    });
};


module.exports = {
    sources,
    typeCountGroupBySource,
    source_stats
};
