const knex = require('../../db/knex');

const compound_target = async ({
    compoundId
}) => {
    const targets = await knex.select()
        .from('drug_targets as dt')
        .join('targets as t', 't.target_id', 'dt.target_id')
        .where('dt.drug_id', compoundId);
};


module.exports = {
    compound_target
};