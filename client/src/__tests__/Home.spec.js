import React from 'react';
import { mount } from 'enzyme';
// wrap in browserrouter or it produces an error that
// says you can't use link outside a router
import { BrowserRouter } from 'react-router-dom';
import Home from '../Components/Home/Home';

// Catch-all snapshot test for entire rendering of home
it('renders Home correctly', () => {
  const component = mount(
    <BrowserRouter>
      <Home />
    </BrowserRouter>,
  );
  expect(component).toMatchSnapshot();
});
