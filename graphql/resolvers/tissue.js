const knex = require('../../db/knex');

/**
 * @param {Number} tissueId - the tissue id.
 */
const cellQuery = async tissueId => {
    const cell_lines = await knex
        .select('d.dataset_id')
        .count('cell_id as total')
        .from('experiments as e')
        .join('datasets as d', 'd.dataset_id', 'e.dataset_id')
        .where('e.tissue_id', 7)
        .groupby('d.dataset_id');
};

/**
 * @param {Number} tissueId - the tissue id.
 */
const tissueQuery = async tissueId => {
    // query
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
const transformTissueAnnotation = data => {
    // return object interface.
    let returnObject = {
        id: 0,
        name: 'empty',
        annotations: []
    };
    const source_tissue_name_list = [];
    // looping through each data point.
    data.forEach((row, i) => {
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
        console.log(tissue);

        // return the transformed data.
        return transformTissueAnnotation(tissue);
    } catch (err) {
        console.log(err);
        return err;
    }
};

module.exports = {
    tissues,
    tissue
};
