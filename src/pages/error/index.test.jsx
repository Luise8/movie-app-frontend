import {
  render, screen, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import Error from 'src/pages/error';
import { MemoryRouter } from 'react-router-dom';
import darkTheme from 'src/utils/darkTheme';
import { ThemeProvider } from '@mui/material';

let mockCurrentUser = {
  id: '123',
  username: 'userNumber1',
};
// mock useUserAuth
jest.mock('src/context/auth', () => ({
  useUserAuth: jest.fn(() => ({
    user: mockCurrentUser,
  })),
}));

jest.mock('src/components/page-layout', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <div data-testid="page-layout">{children}</div>),
}));

it('right render of data', async () => {
  render(
    <MemoryRouter>
      <Error />
    </MemoryRouter>,
  );

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page');
  expect(page).toBeInTheDocument();

  const img = screen.getByAltText(/sign with the word oops/i);
  expect(img).toHaveAttribute('aria-hidden', 'true');

  expect(screen.getByRole('heading', {
    name: /Something wrong/i,
    level: 1,
  })).toBeInTheDocument();

  expect(screen.getByRole('link', {
    name: /Go back home/i,
  })).toBeInTheDocument();
});

it('right render of loading state', () => {
  // Change to initial user state
  mockCurrentUser = {};

  render(
    <MemoryRouter>
      <Error />
    </MemoryRouter>,
  );
  expect(screen.getByLabelText(/loading.../i)).toBeInTheDocument();
  expect(screen.queryByTestId('page-layout')).not.toBeInTheDocument();
});

it('right classes and inline styles', () => {
  // logged user
  mockCurrentUser = {
    id: '123',
    username: 'userNumber1',
  };
  render(
    <MemoryRouter>
      <ThemeProvider theme={darkTheme}>
        <Error />
      </ThemeProvider>
    </MemoryRouter>,
  );

  expect(screen.getByTestId('page')).toHaveClass('error');

  expect(screen.getByTestId('error-container')).toHaveClass('error-container');

  expect(screen.getByTestId('error-container-image')).toHaveClass('error-container-image');

  expect(screen.getByRole('heading', {
    name: /Something wrong/i,
    level: 1,
  })).toHaveStyle(`color: ${darkTheme.palette.error.dark}`);

  expect(screen.getByRole('link', {
    name: /Go back home/i,
  })).toHaveStyle(`color: ${darkTheme.palette.background.default}`);
});
