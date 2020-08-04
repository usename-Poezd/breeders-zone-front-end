const compareMorph = (traitTitle, geneTitle) => {
    return traitTitle === 'Normal' || traitTitle === 'Visual' ? `${geneTitle}` : `${traitTitle} ${geneTitle}`;
};


export default compareMorph;
