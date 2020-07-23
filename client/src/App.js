import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import { IndivCompounds, Compounds, Home } from './Components/index';
import GlobalStyles from './styles/GlobalStyles';

// apollo client setup.
const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql', // making requests to this endpoint.
});

const App = () => (
  <ApolloProvider client={client}>
    <GlobalStyles />
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/compounds" exact component={Compounds} />
        <Route path="/compounds/:id" component={IndivCompounds} />
      </Switch>
    </Router>
  </ApolloProvider>
);

export default App;
