const knex = require('../../db/knex');
// const { transformObject } = require('../../helpers/transformObject');

/**
 * Returns a transformed array of objects.
 * @param {array} data
 */
const transformExperiment = data => {
    return data.map(experiment => {
        const { experiment_id, cell_id, cell_name, drug_id, dataset_id, tissue_id, tissue_name, drug_name, dataset_name } = experiment;
        return {
            id: experiment_id,
            cell_id,
            drug_id,
            dataset_id,
            tissue: {
                id: tissue_id,
                name: tissue_name
            },
            cell_line: {
                id: cell_id,
                name: cell_name
            },
            compound: {
                id: drug_id,
                name: drug_name
            },
            dataset: {
                id: dataset_id,
                name: dataset_name
            }
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
            .select(
                'experiment_id',
                'cell_name',
                'experiments.tissue_id',
                'experiments.cell_id as cell_id',
                'experiments.tissue_id as tissue_id',
                'experiments.drug_id as drug_id',
                'experiments.dataset_id as dataset_id',
                'tissue_name',
                'drug_name',
                'dataset_name'
            )
            .from('experiments')
            .limit(1000)
            .join('cells', 'cells.cell_id', '=', 'experiments.cell_id')
            .join('tissues', 'tissues.tissue_id', '=', 'experiments.tissue_id')
            .join('drugs', 'drugs.drug_id', '=', 'experiments.drug_id')
            .join('datasets', 'datasets.dataset_id', '=', 'experiments.dataset_id');
            
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