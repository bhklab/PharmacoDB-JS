const knex = require('../../db/knex');
const { transformObject } = require('../../helpers/transformObject');

/**
 * Number of cell lines of a particular tissue per dataset
 * @param {Number} tissueId - the tissue id.
 * @returns {Array} - returns array of objects.
 *      {
 *          dataset: 'dataset name',
 *          total: 'number of cells of 'tissueId' tissue in the dataset'
 *      }
 */
const cellQuery = async tissueId => {
    const data = await knex
        .select('d.dataset_name as dataset_name', 'd.dataset_id as dataset_id')
        .count('dc.cell_id as total')
        .from('dataset_cells as dc')
        .join('cells as c', 'c.cell_id', 'dc.cell_id')
        .join('datasets as d', 'd.dataset_id', 'dc.dataset_id')
        .where('c.tissue_id', tissueId)
        .groupBy('dc.dataset_id');
    return transformObject(data);
};

/**
 * Number of compounds tested with a particular tissue cellline.
 * @param {Number} tissueId - the tissue id.
 */
const compoundQuery = async tissueId => {
    const data = await knex
        .select('d.dataset_name as dataset_name', 'd.dataset_id as dataset_id')
        .countDistinct('e.drug_id as total')
        .from('experiments as e')
        .join('datasets as d', 'd.dataset_id', 'e.dataset_id')
        .where('tissue_id', tissueId)
        .groupBy('d.dataset_id');
    return transformObject(data);
};

/**
 * @param {Number} tissueId - the tissue id.
 *  {
 *      id: 'tissue id',
 *      name: 'tissue name',
 *      annotations: [
 *          {
 *              name: 'Adrenal - different name of the tissue used in the source',
 *              dataset: 'name of the source(dataset name in our case) it belongs to'
 *          }
 *      ]
 *  }
 */
const tissueQuery = async tissueId => {
    return await knex
        .select(
            'tissues.tissue_id as tissue_id',
            'tissues.tissue_name as tissue_name',
            'source_tissue_names.tissue_name as source_tissue_name',
            'datasets.dataset_name as dataset_name'
        )
        .from('tissues')
        .join(
            'source_tissue_names',
            'tissues.tissue_id',
            'source_tissue_names.tissue_id'
        )
        .join('sources', 'sources.source_id', 'source_tissue_names.source_id')
        .join('datasets', 'datasets.dataset_id', 'sources.dataset_id')
        .where('tissues.tissue_id', tissueId);
};

/**
 * Returns a transformed array of objects.
 * @param {Array} data
 * @returns {Object} - transformed object.
 */
const transformTissueAnnotation = (tissue, cell_count, compound_tested) => {
    console.log(compound_tested);
    // return object interface.
    let returnObject = {
        id: 0,
        name: 'empty',
        annotations: []
    };
    const source_tissue_name_list = [];
    // looping through each data point.
    tissue.forEach((row, i) => {
        const { tissue_id, tissue_name, dataset_name } = row;
        let { source_tissue_name } = row;
        source_tissue_name = source_tissue_name.replace(' ', '');

        // if it's the first element.
        if (!i) {
            returnObject['id'] = tissue_id;
            returnObject['name'] = tissue_name;
            returnObject['annotations'].push({
                name: source_tissue_name,
                datasets: [dataset_name]
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
                returnObject['annotations'].push({
                    name: source_tissue_name,
                    datasets: [dataset_name]
                });
            } else if (source_tissue_name_list.includes(source_tissue_name)) {
                returnObject['annotations'].forEach((val, i) => {
                    if (val['name'] === source_tissue_name) {
                        returnObject['annotations'][i]['datasets'].push(
                            dataset_name
                        );
                    }
                });
            }
        }
    });
    return returnObject;
};

/**
 * @returns {Array} Returns the transformed data for all the datasets in the database.
 */
const tissues = async () => {
    try {
        const tissues = await knex.select().from('tissues');
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
const tissue = async args => {
    try {
        // grabbing the tissue line id from the args.
        const { tissueId } = args;

        const tissue = await tissueQuery(tissueId);
        const cell_count = await cellQuery(tissueId);
        const compound_tested = await compoundQuery(tissueId);

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
