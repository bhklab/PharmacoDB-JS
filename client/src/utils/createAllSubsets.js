/**
 * List all the subsets of a set.
 * @param {Array} set
 */
const createAllSubsets = (set) => {
    //setSize of power set of a set with setSize n is (2**n -1)
    const setSize = set.length;
    let powSetSize = parseInt(Math.pow(2, setSize));
    let finalSubsets = [];

    // Run from counter 000..0 to 111..1
    for (let counter = 0; counter < powSetSize; counter++) {
        let subset = [];
        for (let j = 0; j < setSize; j++) {
            // Check if jth bit in the counter is set If set then print jth element from set
            if ((counter & (1 << j)) > 0) {
                subset.push(set[j]);
            }
        }
        finalSubsets.push(subset);
    }
    return finalSubsets;
};

export default createAllSubsets;
