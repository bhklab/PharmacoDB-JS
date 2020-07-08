const knex = require('../../db/knex');
const { transformObject } = require('../../helpers/transformObject');
const { calcLimitOffset } = require('../../helpers/calcLimitOffset');

/**
 * @param {Array} data
 * @returns {Array} - Returns a transformed array of objects.
 */
const transformCompound = data => {
    return data.map(compound => {
        const { drug_id, drug_name, smiles, inchikey, pubchem } = compound;
        return {
            id: drug_id,
            name: drug_name,
            annotation: {
                smiles: smiles,
                inchikey: inchikey,
                pubchem: pubchem
            }
        };
    });
};

/**
 *  @param {Number} - compoundId.
 *
 */
// todo: change the query using `compound` based on the new database compound table.
const compoundSourceQuery = async compoundId => {
    return await knex
        .select(
            'drugs.drug_id as compound_id',
            'drugs.drug_name as compound_name',
            'source_drug_names.drug_name as source_compound_name',
            'datasets.dataset_name as dataset_name'
        )
        .from('drugs')
        .join('source_drug_names', 'drugs.drug_id', 'source_drug_names.drug_id')
        .join('sources', 'sources.source_id', 'source_drug_names.source_id')
        .join('datasets', 'datasets.dataset_id', 'sources.dataset_id')
        .where('drugs.drug_id', compoundId);
};

/**
 * @param {Number} - compoundId.
 * @returns {Object} - compound object.
 */
const compoundQuery = async compoundId => {
    return await knex
        .select()
        .from('drugs')
        .join('drug_annots', 'drugs.drug_id', 'drug_annots.drug_id')
        .where('drugs.drug_id', compoundId);
};

/**
 * Returns the transformed data for all the compounds in the database.
 * @param {Object} data - Parameters for the data.
 * @param {number} [data.page = 1] - Current page number.
 * @param {number} [data.per_page = 20] - Total values per page.
 * @param {boolean} [data.all = false] - Boolean value whether to show all the data or not.
 */
const compounds = async ({ page = 1, per_page = 20, all = false }) => {
    // setting limit and offset.
    const { limit, offset } = calcLimitOffset(page, per_page);
    // try catch block and the query to get the data for all the compounds based on the arguments.
    try {
        // query to get the data for all the compounds.
        const compounds = await knex
            .select()
            .from('drugs')
            .join('drug_annots', 'drugs.drug_id', 'drug_annots.drug_id')
            .limit(all ? '*' : limit)
            .offset(all ? '*' : offset);
        // return the transformed data.
        return transformCompound(compounds);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/**
 * Returns the transformed data for the queried compound in the database.
 * @param {Object} args
 */
const compound = async args => {
    try {
        // grabbing the compound id from the args.
        const { compoundId } = args;
        // query to get the data based on the compound id.
        let compoundData = await compoundQuery(compoundId);
        // query to get compound source synonyms.
        let compoundSynonyms = await compoundSourceQuery(compoundId);
        console.log(compoundSynonyms);
        // transforming the rowdatapacket object.
        const compound = transformObject(compoundData);
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
