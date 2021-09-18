export const convertMDataType = (mDataType) => {
    switch(mDataType) {
        case 'rna':
            return 'rna microarray';
        case 'rnaseq':
            return 'rna sequence';
        default:
            return /rnaseq$/.test(mDataType) ? 'rna sequence' : mDataType;
    }
}

export const mDataTypeList = {
    rna_sequence: 'rna sequence',
    rna_microarray: 'rna microarray',
    cnv: 'cnv',
    mutation: 'mutation'
};
