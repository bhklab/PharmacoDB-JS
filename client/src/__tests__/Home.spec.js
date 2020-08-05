import React from 'react';
import { shallow } from 'enzyme';
// wrap in browserrouter or it produces an error that
// says you can't use link outside a router
import { BrowserRouter } from 'react-router-dom';
import Home from '../Components/Home/Home';

// Catch-all snapshot test for shallow rendering of home
// I chose to do shallow rendering because mounting would mean I'd have to
// worry about the async act for mounting the search bar.
it('renders Home correctly', () => {
  const component = shallow(
    <BrowserRouter>
      <Home />
    </BrowserRouter>,
  );
  expect(component).toMatchSnapshot();
});
