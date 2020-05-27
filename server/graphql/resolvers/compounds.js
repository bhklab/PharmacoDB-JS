const knex = require('../../db/knex');

module.exports = {
    compounds: async () => {
        try {
            const compounds = await knex.select().from('drugs');
            return compounds.map((compound) => {
                return {
                    id: compound.drug_id,
                    name: compound.drug_name
                }
            })
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}