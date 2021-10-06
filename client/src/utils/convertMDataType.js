export const convertMDataType = (mDataType) => {
    switch (mDataType) {
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
    rnaseq: 'rna sequence',
    'Kallisto_0.46.1.rnaseq': 'rna sequence',
    rna_microarray: 'rna microarray',
    rna: 'rna microarray',
    microarray: 'rna microarray',
    cnv: 'cnv',
    mutation: 'mutation',
};
