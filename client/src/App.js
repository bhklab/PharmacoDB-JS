import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
  Drugs
} from './Components/index';


function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Drugs} />
      </Switch>
    </Router>
  );
}


export default App;
