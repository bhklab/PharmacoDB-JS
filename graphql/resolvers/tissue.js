const knex = require('../../db/knex');
const { transformObject } = require('../../helpers/transformObject');
const { calcLimitOffset } = require('../../helpers/calcLimitOffset');
const { retrieveFields, retrieveSubtypes } = require('../../helpers/queryHelpers');

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
        .select('d.name as dataset_name', 'd.id as dataset_id')
        .count('dc.cell_id as total')
        .from('dataset_cell as dc')
        .join('cell as c', 'c.id', 'dc.cell_id')
        .join('dataset as d', 'd.id', 'dc.dataset_id')
        .join('tissue as t', 't.id', 'c.tissue_id');

    if (tissueId) {
        query = await subQuery.where('t.id', tissueId)
            .groupBy('dc.dataset_id');
    } else if (tissueName) {
        query = await subQuery.where('t.name', tissueName)
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
        .select('d.name as dataset_name', 'd.id as dataset_id')
        .countDistinct('e.compound_id as total')
        .from('experiment as e')
        .join('dataset as d', 'd.id', 'e.dataset_id')
        .join('tissue as t', 't.id', 'e.tissue_id');

    if (tissueId) {
        query = await subQuery.where('t.id', tissueId)
            .groupBy('d.id');
    } else if (tissueName) {
        query = await subQuery.where('t.name', tissueName)
            .groupBy('d.id');
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
const tissueSourceQuery = async (tissueId, tissueName, subtypes) => {
    let query;
    // if the subtypes contains 'synonyms'.
    if (subtypes.includes('synonyms')) {
        query = knex
            .select('tissue.id as tissue_id',
                'tissue.name as tissue_name',
                'tissue_synonym.tissue_name as source_tissue_name',
                'dataset.name as dataset_name')
            .from('tissue')
            .leftJoin('tissue_synonym', 'tissue.id', 'tissue_synonym.tissue_id')
            .leftJoin('dataset_tissue', 'dataset_tissue.tissue_id', 'tissue.id')
            .leftJoin('dataset', 'dataset.id', 'dataset_tissue.dataset_id');
    } else {
        query = knex.select().from('tissue');
    }
    // based on the tissueId passed or tissueName passed.
    if (tissueId) {
        return await query.where('tissue.id', tissueId);
    } else if (tissueName) {
        return await query.where('tissue.name', tissueName);
    }

};

/**
 * Returns a transformed array of objects.
 * @param {Array} data
 * @returns {Array} - transformed array of objects.
 */
const transformTissues = data => {
    // object to store the final result.
    const finalData = {};
    console.log("data",data)
    // preparing the transformed data.
    data.forEach(tissue => {
        const {
            id,
            name,
            dataset_id,
            dataset_name,
        } = tissue;

        if (finalData[id]) {
            const isPresent = finalData[id]['dataset'].filter(el => el.name === dataset_name);
            if (isPresent.length === 0) {
                finalData[id]['dataset'].push({
                    id: dataset_id,
                    name: dataset_name,
                });
            }
        } else {
            finalData[id] = {
                id: id,
                name: name,
                dataset: [{
                    id: dataset_id,
                    name: dataset_name,
                }]
            };
        }
    });
    // return the final data.
    return Object.values(finalData);
};

/**
 *
 * @param {Array} tissue
 * @param {Array} cell_count
 * @param {Array} compound_tested
 * @param {Array} subtypes
 * @returns {Object} - transformed object.
 */
const transformTissueAnnotation = (tissue, cell_count, compound_tested, subtypes) => {
    // return object interface.
    let returnObject = {
        id: 0,
        name: 'empty',
        synonyms: []
    };

    const source_tissue_name_list = [];
    // looping through each data point.
    tissue.forEach((row, i) => {
        // only return tissue_name if source_tissue_name is N/A
        if (row.source_tissue_name == null) {
            returnObject.name = row.tissue_name;
            return returnObject;
        }

        const {
            tissue_id,
            tissue_name,
            dataset_name
        } = row;
        let {
            source_tissue_name
        } = row;

        if (subtypes.includes('synonyms')) source_tissue_name = source_tissue_name.replace(' ', '');

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
        //comment: not taking care of the fields queried and limiting the query to the db as the tables are small.
        const query = knex
            .select('d.id as dataset_id', 'd.name as dataset_name', 't.id as id', 't.name as name')
            .from('tissue as t')
            .join('dataset_tissue as dt', 't.id', 'dt.tissue_id')
            .join('dataset as d', 'd.id', 'dt.dataset_id');
        // if the user has not queried to get all the compound,
        // then limit and offset will be used to give back the queried limit.
        if (!all) {
            query.limit(limit).offset(offset);
        }
        // awaits for the query.
        const tissues = await query;
        // return the transformed data.
        return transformTissues(tissues);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/**
 * @param {Object} args - arguments passed to the tissue function.
 * @param {string} args.tissueName
 * @param {number} args.tissueId
 */
// this is not the annotation directly like compound and gene,
// but more like names in different sources.
const tissue = async (args, parent, info) => {
    try {
        // grabbing the tissue line id from the args.
        const {
            tissueId,
            tissueName
        } = args;
        // throw error if neither of the arguments are passed.
        if (!tissueId && !tissueName) {
            throw new Error('Please specify alteast one of the ID or the Name of the tissue you want to query!');
        }
        // extracts list of fields requested by the client
        const listOfFields = retrieveFields(info);
        const subtypes = retrieveSubtypes(listOfFields);

        const tissue = await tissueSourceQuery(tissueId, tissueName, subtypes);
        const cell_count = subtypes.includes('cell_count') ? await cellCountQuery(tissueId, tissueName) : [];
        const compound_tested = subtypes.includes('compounds_tested') ? await compoundTestedQuery(tissueId, tissueName) : [];

        // return the transformed data.
        return transformTissueAnnotation(tissue, cell_count, compound_tested, subtypes);
    } catch (err) {
        console.log(err);
        return err;
    }
};

module.exports = {
    tissues,
    tissue
};
