const knex = require('../../db/knex');
const { calcLimitOffset } = require('../../helpers/calcLimitOffset');
const { single_compound_target } = require('./target');
const { transformFdaStatus } = require('../../helpers/dataHelpers');
const { retrieveFields, retrieveSubtypes } = require('../../helpers/queryHelpers');

/**
 *
 * @param {string} compound - compound name
 * @returns {number} - compound id
 */
const getIdBasedOnCompound = async (compound) => {
    // compound id.
    let compoundId = '';

    // if compound is passed, query the db else return an Error.
    if (compound) {
        compoundId = await knex.select('compound.id')
            .from('compound')
            .where('name', compound);
    } else {
        return Error('Please provide a valid compound name!!');
    }

    // returns the compound id.
    return compoundId[0].id;
};

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
 *        'name': 'paclitaxel',
 *          'source': [
 *            'gCSI',
 *            'CTRPv2'
 *          ]
 *       }
 */
const transformSynonyms = data => {
    const returnList = {};
    data.map((value, i) => {
        const {
            source_compound_name,
            dataset_id,
            dataset_name
        } = value;
        if (!i || !Object.keys(returnList).includes(source_compound_name.trim())) {
            returnList[source_compound_name] = {
                name: source_compound_name,
                source: [{ 'id': dataset_id, 'name': dataset_name }]
            };
        } else if (Object.keys(returnList).includes(source_compound_name.trim())) {
            if (!returnList[source_compound_name.trim()]['source'].filter(source => source.id === dataset_id).length > 0)
                returnList[source_compound_name.trim()]['source'].push({ 'id': dataset_id, 'name': dataset_name });
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
    const returnList = [];
    data.forEach((compound,i) => {
        const {
            id,
            name,
            compound_uid,
            smiles,
            inchikey,
            pubchem,
            fda_status,
            chembl_id,
            dataset_id,
            dataset_name,
            reactome_id,
        } = compound;

        if (!i || !returnList.filter(item => item["uid"]===compound_uid).length> 0)
        {
            const returnData = {
                'smiles': [],
                'inchikey': []
            };

            if (smiles) {
                smiles.split(', ').forEach((item) => {
                    if (!returnData['smiles'].includes(item)) returnData['smiles'].push(item);
                });
            }
            if (inchikey) {
                inchikey.split(', ').forEach((item) => {
                    if (!returnData['inchikey'].includes(item)) returnData['inchikey'].push(item);
                });
            }
            returnList.push({
                id,
                name,
                uid: compound_uid,
                annotation: {
                    smiles: returnData['smiles'].join(', '),
                    inchikey: returnData['inchikey'].join(', '),
                    pubchem: pubchem,
                    fda_status: transformFdaStatus(fda_status),
                    chembl: chembl_id,
                    reactome: reactome_id || 'NA'
                },
                dataset: [{
                    id: dataset_id,
                    name: dataset_name,
                }]
            })
        } else {
            returnList[returnList.findIndex(item => item['uid']===compound_uid)]['dataset'].push({id: dataset_id, name: dataset_name})
        }
    });
    return returnList;
};

/**
 * @param {number} compoundId
 * @param {string} compoundName
 * @param {Array} compoundData
 * @param {Array} compoundSynonyms
 * @param {Array} subtypes
 */
const transformSingleCompound = async (compoundId, compoundName, compoundUID, compoundData, compoundSynonyms, subtypes) => {
    try {
        const transformedCompound = transformCompounds(compoundData);
        const transformedSynonyms = compoundSynonyms ? transformSynonyms(compoundSynonyms) : '';
        const targets = subtypes.includes('targets') ? await single_compound_target({
            compoundId,
            compoundName,
            compoundUID,
        }) : { targets: [] };
        const output = {
            compound: transformedCompound[0],
            synonyms: transformedSynonyms,
            targets: targets['targets'].map(el => (
                {
                    id: el.target_id,
                    name: el.target_name,
                }
            )),
        };
        return output;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/**
 *  @param {number} - compoundId.
 *  @param {string} - compoundName
 */
// todo: change the query using `compound` based on the new database compound table.
const compoundSourceSynonymQuery = async (compoundUID, compoundId, compoundName) => {
    // main query to grab the required data.
    const query = knex
        .select('compound.id as compound_id',
            'compound.compound_uid as compound_uid',
            'compound.name as compound_name',
            'compound_synonym.compound_name as source_compound_name',
            'dataset.id as dataset_id',
            'dataset.name as dataset_name')
        .from('compound')
        .join('compound_synonym', 'compound.id', 'compound_synonym.compound_id')
        .join('dataset', 'dataset.id', 'compound_synonym.dataset_id');
    // return sub query based on the compoundId or compoundName.
    if (compoundUID) {
        return await query.where('compound.compound_uid', compoundUID);
    } else if (compoundId) {
        return await query.where('compound.id', compoundId);
    } else if (compoundName) {
        return await query.where('compound.name', compoundName);
    }
};

/**
 * @param {number} - compoundId.
 * @param {string} - compoundName.
 * @returns {Object} - compound object.
 */
const compoundQuery = async (compoundUID, compoundId, compoundName, subtypes) => {
    // the base query.
    let baseQuery = knex.select().from('compound');
    // if the subtypes contains annotation type
    if (subtypes.includes('annotation')) baseQuery = baseQuery.join('compound_annotation', 'compound.id', 'compound_annotation.compound_id');
    // return value.
    if (compoundUID) {
        return baseQuery.where('compound.compound_uid', compoundUID);
    } else if (compoundId) {
        return baseQuery.where('compound.id', compoundId);
    } else if (compoundName) {
        return baseQuery.where('compound.name', compoundName);
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

        // select fields.
        const selectFields = ['c.id as id', 'c.name as name', 'c.compound_uid'];
        // add dataset detail to the list of knex columns to select.
        if (listOfFields.includes('dataset')) selectFields.push('d.name as dataset_name', 'd.id as dataset_id');
        // add compound annotation to the list of knex columns to select.
        if (listOfFields.includes('annotation')) selectFields.push('ca.smiles', 'ca.pubchem', 'ca.fda_status', 'ca.inchikey', 'ca.chembl_id', 'ca.reactome_id');

        // query to get the data for all the compounds.
        let query = knex.select(...selectFields).from('compound as c');
        // add a join to grab the compound annotations in case it's queried by the user.
        if (listOfFields.includes('annotation')) query = query.join('compound_annotation as ca', 'ca.compound_id', 'c.id');
        // add a join to grab the dataset information if it's been queried by the user.
        if (listOfFields.includes('dataset')) query = query.join('dataset_compound as dc', 'c.id', 'dc.compound_id')
            .join('dataset as d', 'dc.dataset_id', 'd.id');

        // if the user has not queried to get all the compound,
        // then limit and offset will be used to give back the queried limit.
        if (!all) {
            query.limit(limit).offset(offset);
        }

        // order by fda status if list of fields includes annotation.
        if (listOfFields.includes('annotation')) {
            query.orderBy('fda_status', 'desc');
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
            compoundName,
            compoundUID
        } = args;
        // throw error if neither of the arguments are passed.
        if (!compoundUID && !compoundId && !compoundName) {
            throw new Error('Please specify atleast one of the ID or the Name of the Compound you want to query!');
        }
        // declaring variables.
        let compoundSynonyms;
        // extracts list of fields requested by the client
        const listOfFields = retrieveFields(info);
        const subtypes = retrieveSubtypes(listOfFields);
        // query to get the data based on the compound id.
        let compoundData = await compoundQuery(compoundUID, compoundId, compoundName, subtypes);
        // query to get compound source synonyms.
        if (subtypes.includes('synonyms')) compoundSynonyms = await compoundSourceSynonymQuery(compoundUID, compoundId, compoundName);
        // return the compound object.
        return transformSingleCompound(compoundId, compoundName, compoundUID, compoundData, compoundSynonyms, subtypes);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = {
    compounds,
    compound,
    getIdBasedOnCompound,
};
