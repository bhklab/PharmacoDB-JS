const targetType = `
    type Target {
        """target id in the database"""
        id: Int!
        """target name in the database"""
        name: String!
    }
`;

const targetWithGeneInfoType = `
    type TargetWithGeneInfo {
        """target id"""
        target_id: Int!
        """target name"""
        target_name: String!
        """gene object"""
        genes: [Gene]
    }
`;

const targetWithCompoundInfoType = `
    type TargetWithCompoundInfo {
        """target id"""
        target_id: Int!
        """target name"""
        target_name: String!
        """compound object"""
        compounds: [CompoundTable]
    }
`;

const geneTargetType = `
    type GeneTarget {
        """gene id in the database"""
        gene_id: Int!
        """gene name in the database"""
        gene_name: String!
        """gene annotation"""
        gene_annotation: GeneAnnotation
        """target object"""
        targets: [TargetWithCompoundInfo]
    }
`;

const compoundTargetType = `
    type CompoundTarget {
        """compound id in the database"""
        compound_id: Int!
        """compound name in the database"""
        compound_name: String!
        """compound unique id"""
        compound_uid: String!
        """target object"""
        targets: [TargetWithGeneInfo]
    }
`;


module.exports = {
    targetType,
    geneTargetType,
    compoundTargetType,
    targetWithGeneInfoType,
    targetWithCompoundInfoType,
};
