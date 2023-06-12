import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const { BrowserRouter } = require('react-router-dom');

// test utils file
const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: BrowserRouter }),
  };
};
export default renderWithRouter;
