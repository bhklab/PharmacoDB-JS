const knex = require('../../db/knex');
const { calcLimitOffset } = require('../../helpers/calcLimitOffset');
const { compound_target } = require('./target');
const { transformFdaStatus } = require('../../helpers/dataHelpers');
const { retrieveFields, retrieveSubtypes } = require('../../helpers/queryHelpers');

/**
 * 
 *  @param {Array} - takes an array of object like below
 *      [{
 *          compound_id: 526,
 *          compound_name: 'paclitaxel',
 *          source_compound_name: 'Paclitaxel',
 *          dataset_name: 'CCLE'
 *      }, ...]
 *  @returns {Object} - returns the object with name of the synonym belonging to the sources.
 *      {
 *        "name": "paclitaxel",
 *          "source": [
 *            "gCSI",
 *            "CTRPv2"
 *          ]
 *       }
 */
const transformSynonyms = data => {
    const returnList = {};
    data.map((value, i) => {
        const {
            source_compound_name,
            dataset_name
        } = value;
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
 * 
 * @param {Array} data
 * @returns {Array} - Returns a transformed array of objects.
 */
const transformCompounds = data => {
    return data.map(compound => {
        const {
            id,
            name,
            drug_uid,
            smiles,
            inchikey,
            pubchem,
            fda_status
        } = compound;
        return {
            id,
            name,
            uid: drug_uid,
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
 * @param {number} compoundId
 * @param {string} compoundName
 * @param {Array} compoundData 
 * @param {Array} compoundSynonyms 
 * @param {Array} subtypes
 */
const transformSingleCompound = async (compoundId, compoundName, compoundData, compoundSynonyms, subtypes) => {
    try {
        const transformedCompound = transformCompounds(compoundData);
        const transformedSynonyms = compoundSynonyms ? transformSynonyms(compoundSynonyms) : '';
        const targets = subtypes.includes('targets') ? await compound_target({
            compoundId: compoundId,
            compoundName: compoundName
        }) : '';
        const output = {
            compound: transformedCompound[0],
            synonyms: transformedSynonyms,
            targets: targets['targets']
        };
        return output;
    } catch(err) {
        console.log(err);
        throw err;
    }
};

/**
 *  @param {number} - compoundId.
 *  @param {string} - compoundName
 */
// todo: change the query using `compound` based on the new database compound table.
const compoundSourceSynonymQuery = async (compoundId, compoundName) => {
    // main query to grab the required data.
    const query = knex
        .select('drug.id as compound_id',
            'drug.name as compound_name',
            'drug_synonym.drug_name as source_compound_name',
            'dataset.name as dataset_name')
        .from('drug')
        .join('drug_synonym', 'drug.id', 'drug_synonym.drug_id')
        .join('dataset_compound', 'dataset_compound.compound_id', 'drug.id')
        .join('dataset', 'dataset.id', 'dataset_compound.dataset_id');
    // return sub query based on the compoundId or compoundName.
    if (compoundId) {
        return await query.where('drug.id', compoundId);
    } else if (compoundName) {
        return await query.where('drug.name', compoundName);
    }
};

/**
 * @param {number} - compoundId.
 * @param {string} - compoundName.
 * @returns {Object} - compound object.
 */
const compoundQuery = async (compoundId, compoundName, subtypes) => {
    // the base query.
    let baseQuery = knex.select().from('drug');
    // if the subtypes contains annotation type
    if (subtypes.includes('annotation')) baseQuery = baseQuery.join('drug_annotation', 'drug.id', 'drug_annotation.drug_id');
    // return value.
    if (compoundId) {
        return baseQuery.where('drug.id', compoundId);
    } else if (compoundName) {
        return baseQuery.where('drug.name', compoundName);
    }
};

/**
 * Returns the transformed data for all the compounds in the database.
 * @param {Object} args - Parameters for the data.
 * @param {number} [args.page = 1] - Current page number with a default value of 1.
 * @param {number} [args.per_page = 20] - Total values per page with a default value of 20.
 * @param {boolean} [args.all = false] - Boolean value whether to show all the data or not with a default value of false.
 */
const compounds = async ({ page = 1, per_page = 20, all = false }, parent, info) => {
    // setting limit and offset.
    const { limit, offset } = calcLimitOffset(page, per_page);
    // try catch block and the query to get the data for all the compounds based on the arguments.
    try {
        // extracts list of fields requested by the client
        const listOfFields = retrieveFields(info).map(el => el.name);
        // query to get the data for all the compounds.
        let query = knex
            .select()
            .from('drug');
        // add a join to grab the drug annotations in case it's queried by the user.
        if (listOfFields.includes('annotation')) query = query.join('drug_annotation', 'drug.id', 'drug_annotation.drug_id');
        // if the user has not queried to get all the compound, 
        // then limit and offset will be used to give back the queried limit.
        if (!all) {
            query.limit(limit).offset(offset);
        }
        // execute the query.
        const compounds = await query;
        // return the transformed data.
        return transformCompounds(compounds);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/**
 * @param {Object} args
 * @param {string} args.compoundName
 * @param {number} args.compoundId
 * @returns {Object} returns the transformed data for the queried compound in the database.
 */
const compound = async (args, parent, info) => {
    try {
        // grabbing the compound id from the args.
        const {
            compoundId,
            compoundName
        } = args;
        // throw error if neither of the arguments are passed.
        if (!compoundId && !compoundName) {
            throw new Error('Please specify atleast one of the ID or the Name of the Compound you want to query!');
        }
        // declaring variables.
        let compoundSynonyms;
        // extracts list of fields requested by the client
        const listOfFields = retrieveFields(info);
        const subtypes = retrieveSubtypes(listOfFields);
        // query to get the data based on the compound id.
        let compoundData = await compoundQuery(compoundId, compoundName, subtypes);
        // query to get compound source synonyms.
        if (subtypes.includes('synonyms')) compoundSynonyms = await compoundSourceSynonymQuery(compoundId, compoundName);
        // return the compound object.
        return transformSingleCompound(compoundId, compoundName, compoundData, compoundSynonyms, subtypes);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = {
    compounds,
    compound
};