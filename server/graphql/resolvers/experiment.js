const knex = require('../../db/knex');
// const { transformObject } = require('../../helpers/transformObject');

/**
 * Returns a transformed array of objects.
 * @param {array} data
 */
const transformExperiment = data => {
    return data.map(experiment => {
        const { experiment_id, cell_id, drug_id, dataset_id, tissue_id } = experiment;
        return {
            id: experiment_id,
            cell_id,
            drug_id,
            dataset_id,
            tissue_id
        };
    });
};

/**
 * Returns the transformed data for 1000 experiments in the database.
 */
// TODO: the code has to be changed in future when new database will be in place.
const experiments = async () => {
    try {
        const experiments = await knex
            .select('experiment_id', 'cell_id', 'drug_id', 'dataset_id', 'tissue_id')
            .from('experiments')
            .limit(1000);
            
        console.log(experiments);
        return transformExperiment(experiments);
    } catch (err) {
        console.log(err);
        throw err;
    }
};


module.exports = {
    experiments
};