const stringType = `
    type StringType {
        id: String!
    }
`;

const intType = `
    type IntType {
        id: Int!
    }
`;


const unionType = `
    union UnionType = StringType | IntType
`;


const unionStringType = `
    input UnionStringType {
        id: UnionType!
    }
`;


module.exports = {
    stringType,
    intType,
    unionType,
    unionStringType
};