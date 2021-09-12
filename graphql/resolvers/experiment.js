/* eslint-disable no-inner-declarations */
/* eslint-disable no-case-declarations */
const knex = require('../../db/knex');
const { calcLimitOffset } = require('../../helpers/calcLimitOffset');
const { retrieveFields, retrieveSubtypes } = require('../../helpers/queryHelpers');
// const { transformObject } = require('../../helpers/transformObject');

/**
 * a helper function for experiments route that generates 2 arrays of columns names based on requested fields, used for query building
 * @param {Array} listOfFields - an output from the retrieveFields helper function
 * @returns {Array} - Returns an array of two. First element of the array is a list of column names for the main query. Second element represent list of columns for the subquery
 * [[ 'experiment_id',
 'cell_id',
 'cell_name',
 'tissue_id',
 'tissue_name',
 'compound_id',
 'compound_name',
 'fda_status',
 'smiles',
 'inchikey',
 'pubchem',
 'dataset_id',
 'dataset_name' ], ...]
 */
const generateExperimentsColumns = listOfFields => {
    // array of columns for the knex main query and subquery
    const columns = ['SE.id as experiment_id'];
    const subqueryColumns = ['experiment.id'];
    // boolean that tracks if tissue information has already been requested
    // tissue can be used as a type in experiments and/or as a type in cell_line
    let tissueRequested = false;
    // adds columns based on client GraphQL query
    listOfFields.forEach(field => {
        switch (field.name) {
            case 'cell_line':
                columns.push(...['cell_id', 'cell_name']);
                subqueryColumns.push(...['experiment.cell_id as cell_id', 'cell.name as cell_name']);
                // adds tissue columns if they are in the subfields of cell_line type and have been already added
                if (field.fields.some(subfield => subfield.name === 'tissue') && !tissueRequested) {
                    tissueRequested = true;
                    columns.push(...['tissue_id', 'tissue_name']);
                    subqueryColumns.push(...['experiment.tissue_id as tissue_id', 'tissue.name as tissue_name']);
                }
                break;
            case 'tissue':
                if (!tissueRequested) {
                    columns.push(...['tissue_id', 'tissue_name']);
                    subqueryColumns.push(...['experiment.tissue_id as tissue_id', 'tissue.name as tissue_name']);
                }
                break;
            case 'compound':
                const compoundColumns = ['fda_status', 'smiles', 'inchikey', 'pubchem'];
                columns.push('compound_id', 'compound_name', ...compoundColumns);
                subqueryColumns.push('experiment.compound_id as compound_id', 'compound.name as compound_name', ...compoundColumns);
                break;
            case 'dataset':
                columns.push(...['dataset_id', 'dataset_name']);
                subqueryColumns.push(...['experiment.dataset_id as dataset_id', 'dataset.name as dataset_name']);
                break;
            case 'dose_response':
                columns.push(...['dose', 'response']);
                break;
            case 'profile':
                columns.push(...field.fields.map(el => el.name));
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
            compound_id,
            dataset_id,
            tissue_id,
            tissue_name,
            compound_name,
            dataset_name,
            dose,
            response,
            fda_status,
            smiles,
            inchikey,
            pubchem,
            HS,
            Einf,
            EC50,
            AAC,
            IC50,
            DSS1,
            DSS2,
            DSS3
        } = row;
        if (!responseObj[experiment_id]) {
            responseObj[experiment_id] = {
                id: experiment_id,
                cell_id,
                compound_id,
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
                    id: compound_id,
                    name: compound_name,
                    annotation: {
                        fda_status: fda_status ? 'Approved' : 'NA',
                        smiles,
                        inchikey,
                        pubchem
                    }
                },
                dataset: {
                    id: dataset_id,
                    name: dataset_name
                },
                profile: {
                    HS,
                    Einf,
                    EC50,
                    AAC,
                    IC50,
                    DSS1,
                    DSS2,
                    DSS3
                },
                dose_response: [{
                    dose,
                    response
                }]
            };
        } else {
            // just pushes dose and response values to an existing experiment
            responseObj[experiment_id].dose_response.push({
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
 * @param {number} [args.compoundId = 1] - Used to filter experiments data by compoundId. If used overrides page, per_page and all parameters (optional).
 * @param {string} [args.compoundName = ''] - Used to filter experiments data by compoundName. If used overrides page, per_page and all parameters (optional).
 * @param {number} [args.cellLineId = 1] - Used to filter experiments data by cellLineId. If used overrides page, per_page and all parameters (optional).
 * @param {string} [args.cellLineName = ''] - Used to filter experiments data by cellLineName. If used overrides page, per_page and all parameters (optional).
 * @param {number} [args.tissueId = 1] - Used to filter experiments data by tissueId. If used overrides page, per_page and all parameters (optional).
 * @param {string} [args.tissueName = ''] - Used to filter experiments data by tissueName. If used overrides page, per_page and all parameters (optional).
 * @param {number} [args.page = 1] - Current page number (optional).
 * @param {number} [args.per_page = 30] - Total values per page (optional).
 * @param {boolean} [args.all = false] - Boolean value whether to show all the data or not (optional).
 * @returns {Array} - Returns the transformed data for all the experiments in the database.
 */
const experiments = async (args, context, info) => {
    // setting limit and offset
    const { page = 1, per_page = 30, all = false, compoundId, compoundName, cellLineId, cellLineName, tissueId, tissueName } = args;
    const { limit, offset } = calcLimitOffset(page, per_page);
    try {
        const listOfFields = retrieveFields(info);
        const subtypes = retrieveSubtypes(listOfFields);
        const [columns, subqueryColumns] = generateExperimentsColumns(listOfFields);
        // subquery builder function, gets experiments metadata. Needed as a subquery because user-specified limit and offset values
        // has to be applied on the experiment level and not be based on the total number of rows
        function subqueryExperiments() {
            let subquery = this.select(subqueryColumns)
                .from('experiment');

            if (compoundId || compoundName) {
                subquery = subquery.where(compoundId ? { 'experiment.compound_id': compoundId } : { 'compound.name': compoundName });
            }
            if (cellLineId || cellLineName) {
                subquery.where(cellLineId ? { 'experiment.cell_id': cellLineId } : { 'cell.name': cellLineName });
            }
            if (tissueId || tissueName) {
                subquery.where(tissueId ? { 'experiment.tissue_id': tissueId } : { 'tissue.name': tissueName });
            }

            subtypes.forEach(subtype => {
                switch (subtype) {
                    case 'cell_line':
                        subquery = subquery.join('cell', 'cell.id', '=', 'experiment.cell_id');
                        break;
                    case 'tissue':
                        subquery = subquery.join('tissue', 'tissue.id', '=', 'experiment.tissue_id');
                        break;
                    case 'compound':
                        subquery = subquery.join('compound', 'compound.id', '=', 'experiment.compound_id')
                            .join('compound_annotation', 'experiment.compound_id', '=', 'compound_annotation.compound_id');
                        break;
                    case 'dataset':
                        subquery = subquery.join('dataset', 'dataset.id', '=', 'experiment.dataset_id');
                        break;
                }
            });
            // removes limit/offset when client passes compoundId, cellLineId, or tissueId argument
            return compoundId || cellLineId || tissueId ? subquery.as('SE') : subquery.limit(all ? '*' : limit)
                .offset(all ? '*' : offset)
                .as('SE');
        }
        let query = knex
            .select(columns)
            .from(subqueryExperiments);
        // joins compound_responses table if needed
        if (subtypes.includes('dose_response')) query = query.join('dose_response', 'SE.id', '=', 'dose_response.experiment_id');
        if (subtypes.includes('profile')) query = query.join('profile', 'SE.id', '=', 'profile.experiment_id');
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
            .select('experiment.id as experiment_id',
                'experiment.cell_id as cell_id',
                'experiment.tissue_id as tissue_id',
                'experiment.compound_id as compound_id',
                'experiment.dataset_id as dataset_id',
                'cell.name as cell_name',
                'tissue.name as tissue_name',
                'compound.name as compound_name',
                'dataset.name as dataset_name',
                'dose',
                'response',
                'fda_status',
                'smiles',
                'inchikey',
                'pubchem',
                'HS',
                'Einf',
                'EC50',
                'AAC',
                'IC50',
                'DSS1',
                'DSS2',
                'DSS3')
            .from('experiment')
            .join('cell', 'cell.id', '=', 'experiment.cell_id')
            .join('tissue', 'tissue.id', '=', 'experiment.tissue_id')
            .join('compound', 'compound.id', '=', 'experiment.compound_id')
            .join('dataset', 'dataset.id', '=', 'experiment.dataset_id')
            .join('dose_response', 'dose_response.experiment_id', '=', 'experiment.id')
            .join('compound_annotation', 'experiment.compound_id', '=', 'compound_annotation.compound_id')
            .join('profile', 'experiment.id', '=', 'profile.experiment_id')
            .where('experiment.id', experimentId);
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
