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
};


module.exports = {
    compound_target
};