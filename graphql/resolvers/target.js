const knex = require('../../db/knex');

/**
 * 
 * @param {number} compoundId 
 * @param {string} compoundName
 */
const targetQuery = async (compoundId, compoundName) => {
    // main query.
    const query = knex.distinct('t.name as target_name')
        .select('d.name as compound_name', 'dt.target_id', 'dt.compound_id')
        .from('compound_target as dt')
        .join('target as t', 't.id', 'dt.target_id')
        .join('compound as d', 'd.id', 'dt.compound_id');
    // subquery.
    if (compoundId) {
        return query.where('d.id', compoundId);
    } else if (compoundName) {
        return query.where('d.name', compoundName);
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