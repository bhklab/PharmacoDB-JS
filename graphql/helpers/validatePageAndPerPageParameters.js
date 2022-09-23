/**
 * 
 * @param {number} pageParam - the current page to display
 * @param {number} perPageParam - number of elemenets to display
 * @returns {object} - with the page and per_page
 */
const validatePageAndPerPageParameters = (pageParam, perPageParam) => {
    let pageNumber = pageParam;
    let perPageCount = perPageParam;

    if(pageNumber < 1) {
        throw Error('Enter a valid page number; greater or equal to 1');
    }

    if(perPageCount < 1) {
        throw Error('Enter a valid per_page parameter; greater or equal to 1');
    }

    return {pageNumber, perPageCount};
};

// Use this to not throw the error and set a default value
// const validatePageAndPerPageParameters = (pageParam, perPageParam) => {
//     // stored the updated values
//     let pageNumber = pageParam;
//     let perPageCount = perPageParam;

//     if(pageNumber < 1) {
//         pageNumber = 1;
//     }

//     if(perPageCount < 1) {
//         perPageCount = 20;
//     }

//     return {pageNumber, perPageCount};
// };

module.exports = {
    validatePageAndPerPageParameters
};
