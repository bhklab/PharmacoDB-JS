const knex = require('../../db/knex');
const { calcLimitOffset } = require('../../helpers/calcLimitOffset');
// const { transformObject } = require('../../helpers/transformObject');

const transformExperiment = (experiment, data) => {
    console.log(experiment);
    console.log(data);
};

/**
 * @param {Array} data
 * @returns {Array} - Returns a transformed array of experiment objects (doesn't include dose reponse).
 */
const transformExperiments = data => {
    return data.map(experiment => {
        const { experiment_id, cell_id, cell_name, drug_id, dataset_id, tissue_id, tissue_name, drug_name, dataset_name} = experiment;
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
 * Returns the transformed data for all the experiments in the database.
 * @param {Object} data - Parameters for the data.
 * @param {number} [data.page = 1] - Current page number.
 * @param {number} [data.per_page = 30] - Total values per page.
 * @param {boolean} [data.all = false] - Boolean value whether to show all the data or not.
 */
const experiments = async ({ page = 1, per_page = 30, all = false }) => {
    // setting limitt and offset
    const { limit, offset } = calcLimitOffset(page, per_page);
    try {
        const experiments = await knex
            .select(
                'experiments.experiment_id as experiment_id',
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
            .join('cells', 'cells.cell_id', '=', 'experiments.cell_id')
            .join('tissues', 'tissues.tissue_id', '=', 'experiments.tissue_id')
            .join('drugs', 'drugs.drug_id', '=', 'experiments.drug_id')
            .join('datasets', 'datasets.dataset_id', '=', 'experiments.dataset_id')
            .limit(all ? '*' : limit)
            .offset(all ? '*' : offset);

        return transformExperiments(experiments);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/**
 * Returns the transformed data for the queried experiment in the database along with relevant dose response values.
 * @param {Object} args
 */
const experiment = async args => {
    try {
        // grabbing the experiment id from the args.
        const { experimentId } = args;
        // query to get experiment related data
        let experiment = await knex
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
            .join('cells', 'cells.cell_id', '=', 'experiments.cell_id')
            .join('tissues', 'tissues.tissue_id', '=', 'experiments.tissue_id')
            .join('drugs', 'drugs.drug_id', '=', 'experiments.drug_id')
            .join('datasets', 'datasets.dataset_id', '=', 'experiments.dataset_id')
            .where('experiment_id', experimentId);
        // query to get dose responses values for the given experiment
        let doseResponses = await knex
            .select('dose', 'response')
            .from('dose_responses')
            .where('experiment_id', experimentId);

        transformExperiment(experiment[0], doseResponses);
        return [{}];
        // // transforming the rowdatapacket object.
        // compound = transformObject(compound);
        // // getting the right data to be sent.
        // const data = transformCompound(compound);
        // // return the first element of the list.
        // return data[0];
    } catch (err) {
        console.log(err);
        throw err;
    }
};


// .join('dose_responses', 'dose_responses.experiment_id', '=', 'experiments.experiment_id')


module.exports = {
    experiment,
    experiments
};