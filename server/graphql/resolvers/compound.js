const knex = require('../../db/knex');
const { transformObject } = require('../../helpers/transformObject');

/**
 * Returns a transformed array of objects.
 * @param {array} data
 */
const transformCompound = data => {
    return data.map(compound => {
        return {
            id: compound.drug_id,
            name: compound.drug_name,
            annotation: {
                drug_id: compound.drug_id,
                smiles: compound.smiles,
                inchikey: compound.inchikey,
                pubchem: compound.pubchem
            }
        };
    });
};

/**
 * Returns the transformed data for all the compounds in the database.
 */
const compounds = async () => {
    try {
        // query to get the data for all the compounds.
        const compounds = await knex
            .select()
            .from('drugs')
            .join('drug_annots', 'drugs.drug_id', 'drug_annots.drug_id');
        // return the transformed data.
        return transformCompound(compounds);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/**
 * Returns the transformed data for the queried compound in the database.
 * @param {object} args
 */
const compound = async args => {
    try {
        // grabbing the compound id from the args.
        const { compoundId } = args;
        // query to get the data based on the compound id.
        let compound = await knex
            .select()
            .from('drugs')
            .join('drug_annots', 'drugs.drug_id', 'drug_annots.drug_id')
            .where('drugs.drug_id', compoundId);
        // transforming the rowdatapacket object.
        compound = transformObject(compound);
        // getting the right data to be sent.
        const data = transformCompound(compound);
        // return the first element of the list.
        return data[0];
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = {
    compounds,
    compound
};
