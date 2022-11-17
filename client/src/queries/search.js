// import { gql } from 'apollo-boost';

// const searchQuery = gql `
//     query Search($input: String) {
//         search(input: $input) {
//             id
//             value
//             type
//         }
//     }
// `;

const searchQuery = `
    query Search($input: String) {
        search(input: $input) {
            id
            value
            type
        }
    }
`;

export {
    searchQuery,
};
