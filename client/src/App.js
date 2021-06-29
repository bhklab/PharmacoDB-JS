import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import SearchContext from './context/SearchContext';
const a;

import {
    IndivCompounds,
    Compounds,
    Biomarker,
    Home,
    NotFoundPage,
    Tissues,
    IndivTissues,
    Genes,
    IndivGenes,
    CellLines,
    IndivCellLines,
    Datasets,
    Experiments,
} from './Components/index';
import GlobalStyles from './styles/GlobalStyles';

// apollo client setup.
const client = new ApolloClient({
    uri: '/graphql', // making requests to this endpoint.
});

const App = () => {
    const { noscroll } = useContext(SearchContext);
    return (
        <div className={`app ${noscroll ? 'noscroll' : null}`}>
            <ApolloProvider client={client}>
                <GlobalStyles />
                <Router>
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/biomarker" component={Biomarker} />
                        <Route path="/compounds" exact component={Compounds} />
                        <Route path="/tissues" exact component={Tissues} />
                        <Route path="/genes" exact component={Genes} />
                        <Route
                            path="/experiments"
                            exact
                            component={Experiments}
                        />
                        <Route path="/cell_lines" exact component={CellLines} />
                        <Route path="/datasets" exact component={Datasets} />
                        <Route
                            path="/compounds/:id"
                            component={IndivCompounds}
                        />
                        <Route
                            path="/cell_lines/:id"
                            component={IndivCellLines}
                        />
                        <Route path="/tissues/:id" component={IndivTissues} />
                        <Route path="/genes/:id" component={IndivGenes} />
                        <Route path="*" component={NotFoundPage} />
                    </Switch>
                </Router>
            </ApolloProvider>
        </div>
    );
};

export default App;
