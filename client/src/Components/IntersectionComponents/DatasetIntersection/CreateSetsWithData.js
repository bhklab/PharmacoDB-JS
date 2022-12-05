/**
 *
 * @param {Object} data - input data.
 * @param {Array} subsets - list of all the subsets.
 */
const createSetsWithData = (data, subsets) => {
    const finalObject = {};
    subsets.forEach((subset, i) => {
        if (subset.length > 0) {
            // union of the data.
            // subset.forEach(el => uniqueValues.push(...data[el]));

            // intersection
            let result = [];
            if (subset.length === 1) {
                result = data[subset[0]];
            } else {
                result = subset.reduce((acc, cur) => {
                    if (typeof (acc) === "string") {
                        return data[acc].filter((el) => data[cur].includes(el));
                    } else {
                        return acc.filter((el) => data[cur].includes(el));
                    }
                });
            }

            // append the object to final object variable.
            if (result.length > 0) {
                finalObject[`set${i}`] = {
                    keys: subset,
                    values: [...new Set(result)],
                    count: result.length,
                }
            }
        }
    })
    return finalObject;
};

export default createSetsWithData;
