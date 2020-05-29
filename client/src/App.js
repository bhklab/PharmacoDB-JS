import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';


import {
  Drugs
} from './Components/index';


// apollo client setup.
const client =  new ApolloClient({
  uri: 'http://localhost:5000/graphql' // making requests to this endpoint.
})


function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route path="/" exact component={Drugs} />
        </Switch>
      </Router>
    </ApolloProvider>
  );
}


export default App;
