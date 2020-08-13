import { createContext } from 'react';

const PageContext = createContext({
  blur: false,
  noscroll: false,
  setBlur: () => {},
  setNoscroll: () => {},
});

export default PageContext;
