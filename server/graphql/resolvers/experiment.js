/* eslint-disable no-inner-declarations */
const knex = require('../../db/knex');
const { calcLimitOffset } = require('../../helpers/calcLimitOffset');
// const { transformObject } = require('../../helpers/transformObject');

/**
 * @param {Array} data
 * @returns {Array} - Returns a transformed array of experiment objects.
 */
const transformExperiments = data => {
    const responseObj = {};
    
    // populates the response object to change data structure and accomodata one-to-many relations 
    data.forEach(row => {
        const { experiment_id, cell_id, cell_name, drug_id, dataset_id, tissue_id, tissue_name, drug_name, dataset_name, dose, response} = row;
        if (!responseObj[experiment_id]) {
            responseObj[experiment_id] = {
                id: experiment_id,
                cell_id,
                drug_id,
                dataset_id,
                tissue: { id: tissue_id, name: tissue_name },
                cell_line: { id: cell_id, name: cell_name },
                compound: { id: drug_id, name: drug_name },
                dataset: { id: dataset_id, name: dataset_name },
                dose_responses: [{ dose, response }]
            };
        } else {
            // just pushes dose and response values to an existing experiment
            responseObj[experiment_id].dose_responses.push({dose, response});
        }
    });
    // transforms object to array of values
    return Object.values(responseObj);
};

/**
 * @param {Object} data - Parameters for the data.
 * @param {number} [data.page = 1] - Current page number.
 * @param {number} [data.per_page = 30] - Total values per page.
 * @param {boolean} [data.all = false] - Boolean value whether to show all the data or not.
 * @returns {Array} - Returns the transformed data for all the experiments in the database.
 */
const experiments = async ({ page = 1, per_page = 30, all = false }) => {
    // setting limitt and offset
    const { limit, offset } = calcLimitOffset(page, per_page);
    try {        
        // gets experiments metadata. Needed as a subquery because user-specified limit and offset values
        // has to be applied on the experiment level and not be based on the total number of rows
        function subqueryExperiments() {
            return this.select(
                'experiment_id',
                'cell_name',
                'experiments.tissue_id as tissue_id',
                'experiments.cell_id as cell_id',
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
                .offset(all ? '*' : offset)
                .as('SE');
        }

        // adds dose responses for all experiments
        const experiments = await knex.select(
            'SE.experiment_id as experiment_id', 'cell_name', 'tissue_id', 'cell_id', 'drug_id', 'dataset_id', 'tissue_name', 'drug_name', 'dataset_name', 'dose', 'response'
        )
            .from(subqueryExperiments)
            .join('dose_responses', 'SE.experiment_id', '=', 'dose_responses.experiment_id');
        return transformExperiments(experiments);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/**
 * @param {Object} args
 * @returns {Object} - Returns the transformed data for the queried experiment in the database along with relevant dose response values.
 */
const experiment = async args => {
    try {
        // grabbing the experiment id from the args.
        const { experimentId } = args;
        // query to get experiment related data
        let experiment = await knex
            .select(
                'experiments.experiment_id as experiment_id',
                'experiments.tissue_id',
                'experiments.cell_id as cell_id',
                'experiments.tissue_id as tissue_id',
                'experiments.drug_id as drug_id',
                'experiments.dataset_id as dataset_id',
                'cell_name',
                'tissue_name',
                'drug_name',
                'dataset_name',
                'dose',
                'response'
            )
            .from('experiments')
            .join('cells', 'cells.cell_id', '=', 'experiments.cell_id')
            .join('tissues', 'tissues.tissue_id', '=', 'experiments.tissue_id')
            .join('drugs', 'drugs.drug_id', '=', 'experiments.drug_id')
            .join('datasets', 'datasets.dataset_id', '=', 'experiments.dataset_id')
            .join('dose_responses', 'dose_responses.experiment_id', '=', 'experiments.experiment_id')
            .where('experiments.experiment_id', experimentId);

        const output = transformExperiments(experiment);
        return output[0];
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