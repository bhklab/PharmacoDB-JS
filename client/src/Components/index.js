import { lazy } from 'react';
import PharmacoGx from './IndividualComponents/IndivDatasets/PharmacoGx/PharmacoGx';

const AboutUs = lazy(() => import('./About/AboutUs/AboutUs'));
const Biomarker = lazy(() => import('./Biomarker/Biomarker'));
const Compounds = lazy(() => import('./SummaryComponents/Compounds/Compounds'));
const CellLines = lazy(() => import('./SummaryComponents/CellLines/CellLines'));
const CiteUs = lazy(() => import('./About/CiteUs/CiteUs'));
const Datasets = lazy(() => import('./SummaryComponents/Datasets/Datasets'));
const Documentation = lazy(() => import('./About/Documentation/Documentation'));
const Experiments = lazy(() => import('./SummaryComponents/Experiments/Experiments'));
const Genes = lazy(() => import('./SummaryComponents/Genes/Genes'));
const Home = lazy(() => import('./Home/Home'));
const IndivCompounds = lazy(() => import('./IndividualComponents/IndivCompounds/IndivCompounds'));
const IndivCellLines = lazy(() => import('./IndividualComponents/IndivCellLines/IndivCellLines'));
const IndivTissues = lazy(() => import('./IndividualComponents/IndivTissues/IndivTissues'));
const IndivGenes = lazy(() => import('./IndividualComponents/IndivGenes/IndivGenes'));
const IndivDatasets = lazy(() => import('./IndividualComponents/IndivDatasets/IndivDatasets'));
const Tissues = lazy(() => import('./SummaryComponents/Tissues/Tissues'));
const IntersectionMain = lazy(() => import('./IntersectionComponents/IntersectionMain'));
const NotFoundPage = lazy(() => import('./UtilComponents/NotFoundPage'));

export {
    Compounds,
    IndivCompounds,
    Home,
    NotFoundPage,
    Tissues,
    IndivTissues,
    Genes,
    IndivGenes,
    CellLines,
    IndivCellLines,
    IndivDatasets,
    Datasets,
    PharmacoGx,
    Experiments,
    Biomarker,
    IntersectionMain,
    AboutUs,
    Documentation,
    CiteUs,
};