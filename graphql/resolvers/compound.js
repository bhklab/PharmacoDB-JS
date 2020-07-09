const knex = require('../../db/knex');
const { calcLimitOffset } = require('../../helpers/calcLimitOffset');

/**
 * @param {Number} - value which is either 1 or 0.
 * @returns {String}
 */
const transformFdaStatus = value => (value ? 'Approved' : 'Not Approved');

/**
 *
 */
const transformSynonyms = data => {
    const returnList = {};
    data.map((value, i) => {
        const { source_compound_name, dataset_name } = value;
        if (!i || !Object.keys(returnList).includes(source_compound_name)) {
            returnList[source_compound_name] = {
                name: source_compound_name,
                source: [dataset_name]
            };
        } else if (Object.keys(returnList).includes(source_compound_name)) {
            returnList[source_compound_name]['source'].push(dataset_name);
        }
    });
    return Object.values(returnList);
};

/**
 * @param {Array} data
 * @returns {Array} - Returns a transformed array of objects.
 */
const transformCompounds = data => {
    return data.map(compound => {
        const {
            drug_id,
            drug_name,
            smiles,
            inchikey,
            pubchem,
            fda_status
        } = compound;
        return {
            id: drug_id,
            name: drug_name,
            annotation: {
                smiles: smiles,
                inchikey: inchikey,
                pubchem: pubchem,
                fda_status: transformFdaStatus(fda_status)
            }
        };
    });
};

/**
 *
 */
const transformSingleCompound = (compoundData, compoundSynonyms) => {
    const transformedCompound = transformCompounds(compoundData);
    const transformedSynonyms = transformSynonyms(compoundSynonyms);

    return {
        compound: transformedCompound[0],
        synonyms: transformedSynonyms
    };
};

/**
 *  @param {Number} - compoundId.
 *
 */
// todo: change the query using `compound` based on the new database compound table.
const compoundSourceSynonymQuery = async compoundId => {
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
        return transformCompounds(compounds);
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
        let compoundSynonyms = await compoundSourceSynonymQuery(compoundId);
        // return the compound object.
        return transformSingleCompound(compoundData, compoundSynonyms);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = {
    compounds,
    compound
};
