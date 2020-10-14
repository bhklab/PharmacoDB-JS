const knex = require('../../db/knex');
const { transformObject } = require('../../helpers/transformObject');
const { calcLimitOffset } = require('../../helpers/calcLimitOffset');

/**
 * Number of cell lines of a particular tissue per dataset
 * @param {Number} tissueId - the tissue id.
 * @returns {Array} - returns array of objects.
 *      {
 *          dataset: 'dataset name',
 *          total: 'number of cells of 'tissueId' tissue in the dataset'
 *      }
 */
const cellCountQuery = async (tissueId, tissueName) => {
    // query variable.
    let query;
    const subQuery = knex
        .select('d.dataset_name as dataset_name', 'd.dataset_id as dataset_id')
        .count('dc.cell_id as total')
        .from('dataset_cells as dc')
        .join('cells as c', 'c.cell_id', 'dc.cell_id')
        .join('datasets as d', 'd.dataset_id', 'dc.dataset_id')
        .join('tissues as t', 't.tissue_id', 'c.tissue_id');

    if (tissueId) {
        query = await subQuery.where('t.tissue_id', tissueId)
            .groupBy('dc.dataset_id');
    } else if (tissueName) {
        query = await subQuery.where('t.tissue_name', tissueName)
            .groupBy('dc.dataset_id');
    }
    return transformObject(query);
};

/**
 * Number of compounds tested with a particular tissue cellline.
 * @param {Number} tissueId - the tissue id.
 */
const compoundTestedQuery = async (tissueId, tissueName) => {
    // query variable.
    let query;
    const subQuery = knex
        .select('d.dataset_name as dataset_name', 'd.dataset_id as dataset_id')
        .countDistinct('e.drug_id as total')
        .from('experiments as e')
        .join('datasets as d', 'd.dataset_id', 'e.dataset_id')
        .join('tissues as t', 't.tissue_id', 'e.tissue_id');

    if (tissueId) {
        query = await subQuery.where('t.tissue_id', tissueId)
            .groupBy('d.dataset_id');
    } else if (tissueName) {
        query = await subQuery.where('t.tissue_name', tissueName)
            .groupBy('d.dataset_id');
    }

    return transformObject(query);
};

/**
 * @param {Number} tissueId - the tissue id.
 * @returns - {
 *      id: 'tissue id',
 *      name: 'tissue name',
 *      synonyms: [
 *          {
 *              name: 'Adrenal - different name of the tissue used in the source',
 *              dataset: 'name of the source(dataset name in our case) it belongs to'
 *          }
 *      ]
 *  }
 */
const tissueSourceQuery = async (tissueId, tissueName) => {
    const query = knex
        .select('tissues.tissue_id as tissue_id',
            'tissues.tissue_name as tissue_name',
            'source_tissue_names.tissue_name as source_tissue_name',
            'datasets.dataset_name as dataset_name')
        .from('tissues')
        .join('source_tissue_names',
            'tissues.tissue_id',
            'source_tissue_names.tissue_id')
        .join('sources', 'sources.source_id', 'source_tissue_names.source_id')
        .join('datasets', 'datasets.dataset_id', 'sources.dataset_id');

    if (tissueId) {
        return await query.where('tissues.tissue_id', tissueId);
    } else if (tissueName) {
        return await query.where('tissues.tissue_name', tissueName);
    }

};

/**
 *
 * @param {Array} data
 * @returns {Object} - transformed object.
 */
const transformTissueAnnotation = (tissue, cell_count, compound_tested) => {
    // return object interface.
    let returnObject = {
        id: 0,
        name: 'empty',
        synonyms: []
    };
    const source_tissue_name_list = [];
    // looping through each data point.
    tissue.forEach((row, i) => {
        const {
            tissue_id,
            tissue_name,
            dataset_name
        } = row;
        let {
            source_tissue_name
        } = row;
        source_tissue_name = source_tissue_name.replace(' ', '');

        // if it's the first element.
        if (!i) {
            returnObject['id'] = tissue_id;
            returnObject['name'] = tissue_name;
            returnObject['synonyms'].push({
                name: source_tissue_name,
                source: [dataset_name]
            });
            returnObject['cell_count'] = cell_count.map(value => {
                return {
                    dataset: {
                        id: value.dataset_id,
                        name: value.dataset_name
                    },
                    count: value.total
                };
            });
            returnObject['compounds_tested'] = compound_tested.map(value => {
                return {
                    dataset: {
                        id: value.dataset_id,
                        name: value.dataset_name
                    },
                    count: value.total
                };
            });
            if (!source_tissue_name_list.includes(source_tissue_name)) {
                source_tissue_name_list.push(source_tissue_name);
            }
        } else {
            // for all other elements.
            if (!source_tissue_name_list.includes(source_tissue_name)) {
                returnObject['synonyms'].push({
                    name: source_tissue_name,
                    source: [dataset_name]
                });
            } else if (source_tissue_name_list.includes(source_tissue_name)) {
                returnObject['synonyms'].forEach((val, i) => {
                    if (val['name'] === source_tissue_name) {
                        returnObject['synonyms'][i]['source'].push(dataset_name);
                    }
                });
            }
        }
    });
    return returnObject;
};

/**
 * @param {Object} args - Parameters for the data.
 * @param {number} [args.page = 1] - Current page number with a default value of 1.
 * @param {number} [args.per_page = 20] - Total values per page with a default value of 20.
 * @param {boolean} [args.all = false] - Boolean value whether to show all the data or not with a default value of false.
 * @returns {Array} - returns an array of the transformed data objects for all the tissues in the database.
 */
const tissues = async ({ page = 1, per_page = 20, all = false }) => {
    // setting limit and offset.
    const { limit, offset } = calcLimitOffset(page, per_page);
    try {
        const query = knex.select().from('tissues');
        // if the user has not queried to get all the compound, 
        // then limit and offset will be used to give back the queried limit.
        if (!all) {
            query.limit(limit).offset(offset);
        }
        const tissues = await query;
        return tissues.map(tissue => {
            return {
                id: tissue.tissue_id,
                name: tissue.tissue_name
            };
        });
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/**
 * @param {Object} args - arguments passed to the tissue function.
 */
// this is not the annotation directly like compound and gene,
// but more like names in different sources.
const tissue = async (args) => {
    try {
        // grabbing the tissue line id from the args.
        const {
            tissueId,
            tissueName
        } = args;

        const tissue = await tissueSourceQuery(tissueId, tissueName);
        const cell_count = await cellCountQuery(tissueId, tissueName);
        const compound_tested = await compoundTestedQuery(tissueId, tissueName);

        // return the transformed data.
        return transformTissueAnnotation(tissue, cell_count, compound_tested);
    } catch (err) {
        console.log(err);
        return err;
    }
};

module.exports = {
    tissues,
    tissue
};