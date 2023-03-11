const knex = require('../../db/knex');
const { calculateRange } = require('../helpers/calculateRange');
const { single_compound_target } = require('./target');
const { transformFdaStatus } = require('../helpers/dataHelpers');
const { retrieveFields, retrieveSubtypes } = require('../helpers/queryHelpers');

/**
 * 
 * @param {string} compound 
 * @returns {Array} - array of compounds
 */
const getCompoundBasedOnName = async (compound) => {
    const compounds = await knex.select()
        .from('compound')
        .where('name', 'like', `%${compound}%`);

    return compounds;
};

/**
 *
 * @param {string} compound - compound name
 * @returns {number} - compound id
 */
const getCompoundIdBasedOnCompoundName = async (compound) => {
    // compound id.
    let compoundId = '';

    // if compound is passed, query the db else return an Error.
    if (compound) {
        compoundId = await knex.select('compound.id')
            .from('compound')
            .where('name', 'like', `%${compound}%`);
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
 *          compound_synonym_name: 'Paclitaxel',
 *          dataset_name: 'CCLE'
 *      }, ...]
 *  @returns {Object} - returns the object with name of the synonym belonging to the sources/datasets.
 *      {
 *        'name': 'paclitaxel',
 *          'dataset': [
 *            'gCSI',
 *            'CTRPv2'
 *          ]
 *       }
 */
const transformSynonyms = data => {
    const returnList = {};
    data.map((value, i) => {
        const {
            compound_synonym_name,
            dataset_id,
            dataset_name
        } = value;
        if (!i || !Object.keys(returnList).includes(compound_synonym_name.trim())) {
            returnList[compound_synonym_name] = {
                name: compound_synonym_name,
                dataset: [{ 'id': dataset_id, 'name': dataset_name }]
            };
        } else if (Object.keys(returnList).includes(compound_synonym_name.trim())) {
            if (!returnList[compound_synonym_name.trim()]['dataset'].filter(source => source.id === dataset_id).length > 0)
                returnList[compound_synonym_name.trim()]['dataset'].push({ 'id': dataset_id, 'name': dataset_name });
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
    const transformedCompounds = {};

    data.forEach(compound => {
        const {
            compound_id, compound_name, compound_uid,
            smiles, inchikey, pubchem, fda_status,
            chembl_id, dataset_id, dataset_name, reactome_id,
        } = compound;

        const returnList = {
            'smiles': [],
            'inchikey': []
        };

        if (smiles) {
            smiles.split(', ').forEach((item) => {
                if (!returnList['smiles'].includes(item)) returnList['smiles'].push(item);
            });
        }
        if (inchikey) {
            inchikey.split(', ').forEach((item) => {
                if (!returnList['inchikey'].includes(item)) returnList['inchikey'].push(item);
            });
        }

        if(transformedCompounds[compound_id]) {
            const isDatasetAlreadyPresent = transformedCompounds[compound_id]['datasets'].find(el => el.name === dataset_id);
        
            if(!isDatasetAlreadyPresent) {
                transformedCompounds[compound_id]['datasets'].push({
                    id: dataset_id,
                    name: dataset_name,
                });
            }
        } else {
            transformedCompounds[compound_id] = { 
                id: compound_id,
                name: compound_name,
                uid: compound_uid,
                annotation: {
                    smiles: returnList['smiles'].join(', '),
                    inchikey: returnList['inchikey'].join(', '),
                    pubchem: pubchem,
                    fda_status: transformFdaStatus(fda_status),
                    chembl: chembl_id,
                    reactome: reactome_id || 'NA'
                },
                datasets: [{
                    id: dataset_id,
                    name: dataset_name,
                }]
            };
        }
    });

    return Object.values(transformedCompounds);
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
                    target_id: el.target_id,
                    target_name: el.target_name,
                    genes: el.genes,
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
const compoundSynonymQuery = async (compoundUID, compoundId, compoundName) => {
    // main query to grab the required data.
    const query = knex
        .select('compound.id as compound_id',
            'compound.compound_uid as compound_uid',
            'compound.name as compound_name',
            'compound_synonym.compound_name as compound_synonym_name',
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
 * 
 * @param {Array} listOfFields - array of fields
 * @returns {Object} - query object
 */
const compoundQuery = (listOfFields) => {
    // select fields.
    const selectFields = ['c.id as compound_id', 'c.name as compound_name', 'c.compound_uid'];
    // add dataset detail to the list of knex columns to select.
    if (listOfFields.includes('datasets')) selectFields.push('d.name as dataset_name', 'd.id as dataset_id');
    // add compound annotation to the list of knex columns to select.
    if (listOfFields.includes('annotation')) selectFields.push('ca.smiles', 'ca.pubchem', 'ca.fda_status', 'ca.inchikey', 'ca.chembl_id', 'ca.reactome_id');

    // query to get the data for all the compounds.
    let query = knex.select(...selectFields).from('compound as c');
    // add a join to grab the compound annotations in case it's queried by the user.
    if (listOfFields.includes('annotation')) query = query.join('compound_annotation as ca', 'ca.compound_id', 'c.id');
    // add a join to grab the dataset information if it's been queried by the user.
    if (listOfFields.includes('datasets')) query = query.join('dataset_compound as dc', 'c.id', 'dc.compound_id')
        .join('dataset as d', 'dc.dataset_id', 'd.id');

    return query;
};


/**
 * ----------------------------------------------------------------
 * All Compounds Resolver Function
 * ----------------------------------------------------------------
 */
/**
 * Returns the transformed data for all the compounds in the database.
 * @param {Object} args - Parameters for the data.
 * @param {number} [args.page = 1] - Current page number with a default value of 1.
 * @param {number} [args.per_page = 20] - Total values per page with a default value of 20.
 * @param {boolean} [args.all = false] - Boolean value whether to show all the data or not with a default value of false.
 */
const compounds = async ({ page = 1, per_page = 20, all = false }, parent, info) => {
    // setting limit and offset; lower/upper bound.
    // const { limit, offset } = calcLimitOffset(page, per_page);
    const { lowerBound, upperBound } = calculateRange(page, per_page);

    // try catch block and the query to get the data for all the compounds based on the arguments.
    try {
        // extracts list of fields requested by the client
        const listOfFields = retrieveFields(info).map(el => el.name);

        // compound query
        let query = compoundQuery(listOfFields);

        // if the user has not queried to get all the compound,
        // then limit and offset will be used to give back the queried limit.
        if (!all) {
            query.whereBetween('c.id', [lowerBound, upperBound]);
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
 * ----------------------------------------------------------------
 * Single Compound Resolver Function
 * ----------------------------------------------------------------
 */
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
        let compoundSynonyms, compoundData;

        // extracts list of fields requested by the client
        const listOfFields = retrieveFields(info);
        const subtypes = retrieveSubtypes(listOfFields);

        // query to get the data based on the compound id.
        let compoundBaseQuery = compoundQuery(subtypes);

        // update compound query based on the parameter passed to the query
        if (compoundUID) {
            compoundData = await compoundBaseQuery.where('c.compound_uid', compoundUID);
        } else if (compoundId) {
            compoundData = await compoundBaseQuery.where('c.id', compoundId);
        } else if (compoundName) {
            compoundData = await compoundBaseQuery.where('c.name', compoundName);
        }

        // query to get compound synonyms.
        if (subtypes.includes('synonyms')) {
            compoundSynonyms = await compoundSynonymQuery(compoundUID, compoundId, compoundName);
        }

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
    getCompoundIdBasedOnCompoundName,
    getCompoundBasedOnName,
};
