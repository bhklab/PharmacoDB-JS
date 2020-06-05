import { gql } from 'apollo-boost';


/**
 * Query returns the list of compounds with the id and name.
 */
const getCompoundsQuery = gql`
    {
        compounds {
            id
            name
        }
    }
`


export {
    getCompoundsQuery
}
