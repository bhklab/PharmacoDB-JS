const knex = require('../../db/knex');

/**
 * 
 * @param {number} compoundId 
 * @param {string} compoundName
 */
const targetQuery = async (compoundId, compoundName) => {
    // main query.
    const query = knex.distinct('t.target_name')
        .select('d.drug_name', 'dt.target_id', 'dt.drug_id')
        .from('drug_targets as dt')
        .join('targets as t', 't.target_id', 'dt.target_id')
        .join('drugs as d', 'd.drug_id', 'dt.drug_id');
    // subquery.
    if (compoundId) {
        return query.where('d.drug_id', compoundId);
    } else if (compoundName) {
        return query.where('d.drug_name', compoundName);
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
            drug_name,
            drug_id
        } = target;
        if (!i) {
            returnObject['compound_id'] = drug_id;
            returnObject['compound_name'] = drug_name;
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