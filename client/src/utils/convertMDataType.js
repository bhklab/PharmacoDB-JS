const convertMDataType = (mDataType) => {
    switch(mDataType) {
        case 'rna':
            return 'microarray rna';
        case 'cnv':
            return 'cnv';
        case 'Kallisto_0.46.1.rnaseq':
            return 'rna sequence';
        default:
            return mDataType;
    }
}

export default convertMDataType;