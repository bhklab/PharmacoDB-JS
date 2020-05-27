const knex = require('../../db/knex');

module.exports = {
    compounds: async () => {
        try {
            const compounds = await knex.select().from('drugs');
            console.log(compounds)
        } catch (err) {
            throw err;
        }
    }
}