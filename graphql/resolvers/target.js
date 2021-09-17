const knex = require('../../db/knex');

/**
 *
 * @param {number} compoundId
 * @param {string} compoundName
 */
const targetQuery = async (compoundId, compoundName) => {
    // main query.
    const query = knex.distinct('t.name as target_name')
        .select('c.name as compound_name', 'ct.target_id', 'c.id as compound_id')
        .from('compound_target as ct')
        .join('target as t', 't.id', 'ct.target_id')
        .join('compound as c', 'c.id', 'ct.compound_id');
    // subquery.
    if (compoundId) {
        return query.where('c.id', compoundId);
    } else if (compoundName) {
        return query.where('c.name', compoundName);
    } else {
        return query;
    }
};

/**
 *
 * @param {Object} args
 * @returns {Object} - {
 * 		compound_id: 'compound id - Number',
 * 		compound_name: 'compound name - String',
 * 		targets: [{
 * 			id: 'target id - Number',
 * 			name: 'target name - String'
 * 		}]
 * }
 */
const compound_target = async (args) => {
    try {
        const {
            compoundId,
            compoundName
        } = args;
        const returnObject = {};
        const targets = await targetQuery(compoundId, compoundName);

        targets.forEach((target, i) => {
            const {
                target_id,
                target_name,
                compound_name,
                compound_id
            } = target;
            if (!i) {
                returnObject['compound_id'] = compound_id;
                returnObject['compound_name'] = compound_name;
                returnObject['targets'] = [];
            }
            returnObject['targets'].push({
                id: target_id,
                name: target_name
            });
        });
        return returnObject;
    } catch (err) {
        console.log(err);
        throw err;
    }

};

const compound_targets = async () => {
    try {
        const query = knex.select('c.name as compound_name', 'ct.target_id', 'c.id as compound_id', 't.name as target_name')
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
                targets: filtered.map(item => ({
                    id: item.target_id,
                    name: item.target_name
                }))
            });
        }
        return data;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/**
 * Used to return targets with associated gene for a given compound.
 * @param {*} args
 */
const gene_compound_target = async (args) => {
    try {
        const {
            compoundId,
            compoundName
        } = args;
        const returnObject = {};

        let query = knex.select('t.name as target_name', 'c.name as compound_name', 'ct.target_id', 'c.id as compound_id', 'gene.id as gene_id', 'gene.name as gene_name', 'gene_annotation.symbol as symbol')
            .from('compound_target as ct')
            .join('target as t', 't.id', 'ct.target_id')
            .join('compound as c', 'c.id', 'ct.compound_id')
            .join('gene_target as gt', 'gt.target_id', 'ct.target_id')
            .join('gene', 'gene.id', 'gt.gene_id')
            .join('gene_annotation', 'gene.id', 'gene_annotation.gene_id');

        if (compoundId) {
            query = query.where('c.id', compoundId);
        } else {
            query = query.where('c.name', compoundName);
        }

        const targets = await query;

        targets.forEach((target, i) => {
            const {
                target_id,
                target_name,
                compound_name,
                compound_id,
                gene_id,
                gene_name,
                symbol
            } = target;
            if (!i) {
                returnObject['compound_id'] = compound_id;
                returnObject['compound_name'] = compound_name;
                returnObject['targets'] = [];
            }
            returnObject['targets'].push({
                id: target_id,
                name: target_name,
                gene: {
                    id: gene_id,
                    name: gene_name,
                    annotation: {
                        gene_id: gene_id,
                        symbol: symbol
                    }
                }
            });
        });
        return returnObject;
    } catch(err) {
        console.log(err);
        throw err;
    }
};

/**
 * Used to return targeted compounds for a given gene.
 * @param {*} args
 */
const compounds_gene_target = async (args) => {
    try {
        const {
            geneId,
            geneName
        } = args;
        const returnObject = {};
        let query = knex
            .select('c.id as compound_id','c.compound_uid as compound_uid', 'c.name as compound_name', 'ct.target_id',
                't.name as target_name', 'gene.id as gene_id', 'gene.name as gene_name', 'gene_annotation.symbol as symbol')
            .from('compound_target as ct')
            .join('target as t', 't.id', 'ct.target_id')
            .join('compound as c', 'c.id', 'ct.compound_id')
            .join('gene_target as gt', 'gt.target_id', 'ct.target_id')
            .join('gene', 'gene.id', 'gt.gene_id')
            .join('gene_annotation', 'gene.id', 'gene_annotation.gene_id');
        if (geneId) {
            query = query.where('gene.id', geneId);
        } else {
            query = query.where('gene.name', geneName);
        }
        const targets = await query;
        targets.forEach((target, i) => {
            const {
                target_id,
                target_name,
                compound_name,
                compound_id,
                compound_uid,
                gene_id,
                gene_name,
                symbol
            } = target;
            if (!i ) {
                returnObject['gene'] = {
                    id: gene_id,
                    name: gene_name,
                    annotation: {
                        gene_id: gene_id,
                        symbol: symbol
                    }
                }
                returnObject['compounds'] = [];
            }
            if (!returnObject['compounds'].filter(item => item.compound_id === compound_id).length>0)
            {
                returnObject['compounds'].push({
                    compound_id: compound_id,
                    compound_name: compound_name,
                    compound_uid: compound_uid,
                    targets: [{ id: target_id, name: target_name}],
                });
            } else {
                returnObject['compounds'].filter(item => item.compound_id === compound_id)[0].targets.push({ id: target_id, name: target_name});
            }
        });
        return returnObject;
    } catch(err) {
        console.log(err);
        throw err;
    }
};

/**
 * @param args either geneId or geneName
 * @returns {Object} returns the list of datasets and the count of compounds in them that are targetting a given gene.
 */
const single_gene_targets_group_by_dataset = async (args) => {
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
            };
        const datasets = await query;
        const targetCompoundCounts = [];
        datasets.forEach((dataset, i) => {
            const {
                dataset_id,
                dataset_name,
                compound_count,
                gene_id,
                gene_name,
            } = dataset;
            returnObject['gene_id'] = gene_id;
            returnObject['gene_name'] = gene_name;
            targetCompoundCounts.push({
                dataset : { id : dataset_id , name: dataset_name},
                compound_count: compound_count,
            })
        });
        returnObject['targetCompoundCounts'] = targetCompoundCounts;
        return returnObject;
    } catch(err) {
        console.log(err);
        throw err;
    }
};

module.exports = {
    compound_target,
    compound_targets,
    gene_compound_target,
    compounds_gene_target,
    single_gene_targets_group_by_dataset,
};
