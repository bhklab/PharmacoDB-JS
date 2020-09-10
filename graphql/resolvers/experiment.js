/* eslint-disable no-inner-declarations */
/* eslint-disable no-case-declarations */
const knex = require('../../db/knex');
const { calcLimitOffset } = require('../../helpers/calcLimitOffset');
const { retrieveFields, retrieveSubtypes } = require('../../helpers/queryHelpers');
// const { transformObject } = require('../../helpers/transformObject');

/**
 * a helper function for experiments route that generates 2 arrays of columns names based on requested fields
 * @param {Array} listOfFields - an output from the retrieveFields helper function
 * @returns {Array} - Returns an array of two. First element of the array is a list of column names for the main query. Second element represent list of columns for the subquery
        * [[ 'experiment_id',
        'cell_id',
        'cell_name',
        'tissue_id',
        'tissue_name',
        'drug_id',
        'drug_name',
        'fda_status',
        'smiles',
        'inchikey',
        'pubchem',
        'dataset_id',
        'dataset_name' ], ...]
 */
const generateExperimentsColumns = listOfFields => {
    // array of columns for the knex main query and subquery
    const columns = ['SE.experiment_id as experiment_id'];
    const subqueryColumns = ['experiment_id'];
    // boolean that tracks if tissue information has already been requested
    // tissue can be used as a type in experiments and/or as a type in cell_line
    let tissueRequested = false;
    // adds columns based on client GraphQL query
    listOfFields.forEach(field => {
        switch (field.name) {
        case 'cell_line':
            columns.push(...['cell_id', 'cell_name']);
            subqueryColumns.push(...['experiments.cell_id as cell_id', 'cell_name']);
            // adds tissue columns if they are in the subfields of cell_line type and have been already added
            if (field.fields.some(subfield => subfield.name === 'tissue') && !tissueRequested) {
                tissueRequested = true;
                columns.push(...['tissue_id', 'tissue_name']);
                subqueryColumns.push(...['experiments.tissue_id as tissue_id', 'tissue_name']);
            }
            break;
        case 'tissue':
            if (!tissueRequested) {
                columns.push(...['tissue_id', 'tissue_name']);
                subqueryColumns.push(...['experiments.tissue_id as tissue_id', 'tissue_name']);
            }
            break;
        case 'compound':
            const compoundColumns = ['drug_name', 'fda_status', 'smiles', 'inchikey', 'pubchem'];
            columns.push('drug_id', ...compoundColumns);
            subqueryColumns.push('experiments.drug_id as drug_id', ...compoundColumns);
            break;
        case 'dataset':
            columns.push(...['dataset_id', 'dataset_name']);
            subqueryColumns.push(...['experiments.dataset_id as dataset_id', 'dataset_name']);
            break;
        case 'dose_responses':
            columns.push(...['dose','response']);
            break;
        }
        

    });
    return [columns, subqueryColumns];
};

/**
 * @param {Array} data
 * @returns {Array} - Returns a transformed array of experiment objects.
 */
const transformExperiments = data => {
    const responseObj = {};
    // populates the response object to change data structure and accomodata one-to-many relations
    data.forEach(row => {
        const {
            experiment_id,
            cell_id,
            cell_name,
            drug_id,
            dataset_id,
            tissue_id,
            tissue_name,
            drug_name,
            dataset_name,
            dose,
            response,
            fda_status,
            smiles,
            inchikey,
            pubchem
        } = row;
        if (!responseObj[experiment_id]) {
            responseObj[experiment_id] = {
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
                    name: cell_name,
                    tissue: {
                        id: tissue_id,
                        name: tissue_name
                    }
                },
                compound: {
                    id: drug_id,
                    name: drug_name,
                    annotation: {
                        fda_status: fda_status ? 'Approved' : 'Not Approved',
                        smiles,
                        inchikey,
                        pubchem
                    }
                },
                dataset: {
                    id: dataset_id,
                    name: dataset_name
                },
                dose_responses: [{
                    dose,
                    response
                }]
            };
        } else {
            // just pushes dose and response values to an existing experiment
            responseObj[experiment_id].dose_responses.push({
                dose,
                response
            });
        }
    });
    // transforms object to array of values
    return Object.values(responseObj);
};

/**
 * Returns list of experiments for a given set of arguments
 * @param {Object} args - args object generated by GraphQL client.
 * @param {Object} context - parent object generated by GraphQL client (not used in the function).
 * @param {Object} info - info object generated by GraphQL client, contains data about requested fields.
 * @param {number} [args.page = 1] - Current page number.
 * @param {number} [args.per_page = 30] - Total values per page.
 * @param {boolean} [args.all = false] - Boolean value whether to show all the data or not.
 * @returns {Array} - Returns the transformed data for all the experiments in the database.
 */
const experiments = async (args, context, info) => {
    // setting limit and offset
    const { page = 1, per_page = 30, all = false } = args;
    const { limit, offset } = calcLimitOffset(page, per_page);
    try {
        const listOfFields = retrieveFields(info);
        const subtypes = retrieveSubtypes(listOfFields);
        const [columns, subqueryColumns] = generateExperimentsColumns(listOfFields);
        // gets experiments metadata. Needed as a subquery because user-specified limit and offset values
        // has to be applied on the experiment level and not be based on the total number of rows
        function subqueryExperiments() {
            let subquery = this.select(subqueryColumns)
                .from('experiments');
            subtypes.forEach(subtype => {
                switch (subtype) {
                case 'cell_line':
                    subquery = subquery.join('cells', 'cells.cell_id', '=', 'experiments.cell_id');
                    break;
                case 'tissue':
                    subquery = subquery.join('tissues', 'tissues.tissue_id', '=', 'experiments.tissue_id');
                    break;
                case 'compound':
                    subquery = subquery.join('drugs', 'drugs.drug_id', '=', 'experiments.drug_id')
                        .join('drug_annots', 'experiments.drug_id', '=', 'drug_annots.drug_id');
                    break;
                case 'dataset':
                    subquery = subquery.join('datasets', 'datasets.dataset_id', '=', 'experiments.dataset_id');
                    break;
                }
            });
            return subquery.limit(all ? '*' : limit)
                .offset(all ? '*' : offset)
                .as('SE');
        }
        let query = knex
            .select(columns)
            .from(subqueryExperiments);
        // joins drug_responses table if needed
        if (subtypes.includes('dose_responses')) query = query.join('dose_responses', 'SE.experiment_id', '=', 'dose_responses.experiment_id');
        const experiments = await query;
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
        const {
            experimentId
        } = args;
        // query to get experiment related data
        let experiment = await knex
            .select('experiments.experiment_id as experiment_id',
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
                'response',
                'fda_status',
                'smiles',
                'inchikey',
                'pubchem')
            .from('experiments')
            .join('cells', 'cells.cell_id', '=', 'experiments.cell_id')
            .join('tissues', 'tissues.tissue_id', '=', 'experiments.tissue_id')
            .join('drugs', 'drugs.drug_id', '=', 'experiments.drug_id')
            .join('datasets', 'datasets.dataset_id', '=','experiments.dataset_id')
            .join('dose_responses', 'dose_responses.experiment_id', '=', 'experiments.experiment_id')
            .join('drug_annots', 'experiments.drug_id', '=', 'drug_annots.drug_id')
            .where('experiments.experiment_id', experimentId);
        const output = transformExperiments(experiment);
        return output[0];
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = {
    experiment,
    experiments
};