import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import SearchContext from './context/SearchContext';

const RenderApp = () => {
  // initializing context values to pass to navbar
  const [blur, setBlur] = useState(false);
  const [noscroll, setNoscroll] = useState(false);
  const value = {
    blur, noscroll, setBlur, setNoscroll,
  };
  return (
    <SearchContext.Provider value={value}>
      <App />
    </SearchContext.Provider>
  );
};
ReactDOM.render(
  // <React.StrictMode>
  <RenderApp />,

  // </React.StrictMode>
  document.getElementById('root'),
);
