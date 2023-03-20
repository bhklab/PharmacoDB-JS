const knex = require('../../knex');

/**
 * target query.
 */
const targetQuery = () => (
    knex.select('compound.name as compound_name', 'compound.id as compound_id', 'compound.compound_uid',
        'gene.name as gene_name', 'gene.id as gene_id', 'gene_annotation.symbol', 'gene_annotation.gene_seq_start',
        'gene_annotation.gene_seq_end', 'gene_annotation.chr', 'gene_annotation.strand',
        'target.id as target_id', 'target.name as target_name')
        .from('compound_target')
        .join('target', 'target.id', 'compound_target.target_id')
        .join('compound', 'compound.id', 'compound_target.compound_id')
        .join('gene_target', 'gene_target.target_id', 'compound_target.target_id')
        .join('gene', 'gene.id', 'gene_target.gene_id')
        .join('gene_annotation', 'gene.id', 'gene_annotation.gene_id')
);

/**
 *
 * @param {Object} args
 * @returns {Object} - {
 * 		compound_id: 'compound id - Number',
 * 		compound_name: 'compound name - String',
 *      compound_uid: 'compound uid - Number',
 * 		targets: [{
 * 			id: 'target id - Number',
 * 			name: 'target name - String',
 *          genes: {
 *              id: 'gene id - Number',
 *              name: 'gene name - String',
 *              annotation: 'annotation object - Object',
 *          }
 * 		}],
 * }
 */
const single_compound_target = async (args) => {
    try {
        // arguments
        const { compoundId, compoundName, compoundUID } = args;

        // if no argument is provided throw an error.
        if (!compoundName && !compoundId && !compoundUID) {
            throw new Error('Invalid input! Query must include compoundId or compoundName or compoundUID');
        }

        // target query.
        let query = targetQuery();
        // sub-query.
        if (compoundId) {
            query = query.where('compound.id', compoundId);
        } else if (compoundName) {
            query = query.where('compound.name', compoundName);
        } else if (compoundUID) {
            query = query.where('compound.compound_uid', compoundUID);
        }

        // targets.
        const targets = await query;

        // return object.
        const returnObject = {};

        targets.forEach((target, i) => {
            const {
                target_id, target_name,
                compound_name, compound_id, compound_uid,
                gene_id, gene_name, symbol,
            } = target;
            if (!i) {
                returnObject['compound_id'] = compound_id;
                returnObject['compound_name'] = compound_name;
                returnObject['compound_uid'] = compound_uid;
                returnObject['targets'] = {};
                returnObject['targets'][target_id] = {
                    target_id: target_id,
                    target_name: target_name,
                    genes: [
                        {
                            id: gene_id,
                            name: gene_name,
                            annotation: {
                                gene_id: gene_id,
                                symbol: symbol
                            }
                        }
                    ],
                };
            } else {
                // if the id of the target is already there just add the gene.
                if (returnObject['targets'][target_id]) {
                    returnObject['targets'][target_id]['genes'].push({
                        id: gene_id,
                        name: gene_name,
                        annotation: {
                            gene_id: gene_id,
                            symbol: symbol
                        }
                    });
                } else {
                    returnObject['targets'][target_id] = {
                        target_id: target_id,
                        target_name: target_name,
                        genes: [
                            {
                                id: gene_id,
                                name: gene_name,
                                annotation: {
                                    gene_id: gene_id,
                                    symbol: symbol
                                }
                            }
                        ],
                    };
                }
            }
        });

        // return object
        // assign empty array for the target field if the compound does not have any targets (returnObject.targets is null).
        return {
            ...returnObject,
            targets: returnObject.targets ? Object.values(returnObject.targets) : [],
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
};


/**
 *
 * @param {Object} args
 * @returns {Object} - {
 * 		gene_id: 'gene id - Number',
 * 		gene_name: 'gene name - String',
 *      gene_annotation: 'gene annotation - Object',
 * 		targets: [{
 * 			id: 'target id - Number',
 * 			name: 'target name - String',
 *          compounds: {
 *              id: 'compound id - Number',
 *              name: 'compound name - String',
 *              uid: 'compound uid - Number',
 *          }
 * 		}],
 * }
 */
const single_gene_target = async (args) => {
    try {
        // arguments
        const { geneId, geneName } = args;

        // if no argument is provided throw an error.
        if (!geneName && !geneId) throw new Error('Invalid input! Query must include geneId or geneName');

        // target query.
        let query = targetQuery();

        // sub-query.
        if (geneId) {
            query = query.where('gene.id', geneId);
        } else if (geneName) {
            query = query.where('gene_annotation.symbol', geneName);
        }

        // targets.
        const targets = await query;

        // return object.
        const returnObject = {};

        targets.forEach((target, i) => {
            const {
                target_id, target_name,
                compound_name, compound_id, compound_uid,
                gene_id, gene_name, symbol,
            } = target;
            if (!i) {
                returnObject['gene_id'] = gene_id;
                returnObject['gene_name'] = gene_name;
                returnObject['gene_annotation'] = {
                    gene_id: gene_id,
                    symbol: symbol
                };
                returnObject['targets'] = {};
                returnObject['targets'][target_id] = {
                    target_id: target_id,
                    target_name: target_name,
                    compounds: [
                        {
                            id: compound_id,
                            name: compound_name,
                            uid: compound_uid,
                        }
                    ],
                };
            } else {
                // if the id of the target is already there just add the gene.
                if (returnObject['targets'][target_id]) {
                    returnObject['targets'][target_id]['compounds'].push({
                        id: compound_id,
                        name: compound_name,
                        uid: compound_uid,
                    });
                } else {
                    returnObject['targets'][target_id] = {
                        target_id: target_id,
                        target_name: target_name,
                        compounds: [
                            {
                                id: compound_id,
                                name: compound_name,
                                uid: compound_uid,
                            }
                        ],
                    };
                }
            }
        });

        // if the object is empty return
        if(returnObject && Object.keys(returnObject).length === 0) {
            return {};
        }

        // return object
        return {
            ...returnObject,
            targets: Object.values(returnObject.targets),
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
};


const all_compound_targets = async () => {
    try {
        const query = knex
            .select('c.compound_uid', 'c.name as compound_name', 'c.id as compound_id',
                'ct.target_id', 't.name as target_name')
            .from('compound_target as ct')
            .join('target as t', 't.id', 'ct.target_id')
            .join('compound as c', 'c.id', 'ct.compound_id');

        const compoundTargets = await query;

        let data = [];
        let compoundIds = compoundTargets.map(item => item.compound_id);
        compoundIds = [...new Set(compoundIds)];
        for (let compoundId of compoundIds) {
            let filtered = compoundTargets.filter(item => item.compound_id === compoundId);
            data.push({
                compound_id: compoundId,
                compound_name: filtered[0].compound_name,
                compound_uid: filtered[0].compound_uid,
                targets: filtered.map(item => ({
                    target_id: item.target_id,
                    target_name: item.target_name
                }))
            });
        }
        return data;
    } catch(err) {
        console.log(err);
        throw err;
    }
};

/**
 * @param args either geneId or geneName
 * @returns {Object} returns the list of datasets and the count of compounds in them that are targeting a given gene.
 */
const compound_targeting_gene_count_per_dataset = async (args) => {
    try {
        const {
            geneId,
            geneName
        } = args;
        const returnObject = [];

        let query = knex.countDistinct('ct.compound_id as compound_count')
            .select('g.id as gene_id', 'g.name as gene_name', 'd.name as dataset_name','d.id as dataset_id')
            .from('gene_target as gt')
            .join('gene as g', 'g.id', 'gt.gene_id')
            .join('target as t', 't.id', 'gt.target_id')
            .join('compound_target as ct', 't.id', 'ct.target_id')
            .join('dataset_compound as dc', 'dc.compound_id', 'ct.compound_id')
            .join('dataset as d', 'd.id', 'dc.dataset_id');
        if (geneId) {
            query = query.where('g.id', geneId).groupBy('d.id');
        } else {
            query = query.where('g.name', geneName).groupBy('d.id');
        }

        const datasets = await query;
        const targetsStat = [];
        datasets.forEach((dataset) => {
            const {
                dataset_id,
                dataset_name,
                compound_count,
                gene_id,
                gene_name,
            } = dataset;
            returnObject['gene_id'] = gene_id;
            returnObject['gene_name'] = gene_name;
            targetsStat.push({
                dataset : { id : dataset_id , name: dataset_name},
                compound_count: compound_count,
            });
        });

        returnObject['targetsStat'] = targetsStat;
        return returnObject;
    } catch(err) {
        console.log(err);
        throw err;
    }
};


module.exports = {
    single_compound_target,
    single_gene_target,
    all_compound_targets,
    compound_targeting_gene_count_per_dataset,
};
