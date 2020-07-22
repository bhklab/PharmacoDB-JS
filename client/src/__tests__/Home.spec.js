import React from 'react';
import { mount } from 'enzyme';
import Home from '../Components/Home/Home';

// Catch-all snapshot test for entire rendering of home
it('renders correctly', () => {
  const component = mount(
    <Home />,
  );
  expect(component).toMatchSnapshot();
});
