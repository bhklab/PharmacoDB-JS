const targetType = `
    type Target {
        """tissue id in the database"""
        id: Int!
        """tissue name in the database"""
        name: String!
    }
`;

const geneTargetType = `
    type GeneTarget {
        """tissue id in the database"""
        id: Int!
        """tissue name in the database"""
        name: String!
        """gene object associated with the target"""
        gene: Gene
    }
`;

const compoundTargetType = `
    type CompoundTarget {
        """compound id in the database"""
        compound_id: Int!
        """compound name in the database"""
        compound_name: String!
        """target object"""
        compound_uid: String!
        """target object"""
        targets: [Target]
    }
`;

const geneCompoundTargetType = `
    type GeneCompoundTarget {
        """compound id in the database"""
        compound_id: Int!
        """compound name in the database"""
        compound_name: String!
        """target object"""
        targets: [GeneTarget]
    }
`;

const compoundsGeneTargetType = `
    type CompoundsGeneTarget {
        """gene id, name, annotation in the database"""
        gene: Gene
        """target object"""
        compounds: [CompoundTarget]
    }
`;

const geneTargetCompoundCountsType = `
    type GeneTargetCompoundCounts {
        """gene id in the database"""
        gene_id: Int!
        """gene id in the database"""
        gene_name: String!
        """ array of datasets and the count of targeting compounds in each"""
        targetsStat: [DatasetCompoundStat]!
    }
`;

module.exports = {
    targetType,
    geneTargetType,
    compoundTargetType,
    geneCompoundTargetType,
    compoundsGeneTargetType,
    geneTargetCompoundCountsType
};
