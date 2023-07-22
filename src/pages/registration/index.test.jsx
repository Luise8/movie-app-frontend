import {
  act, render, screen, waitFor, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import {
  MemoryRouter, Route, Routes,
} from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import darkTheme from 'src/utils/darkTheme';
import linkRoutes from 'src/utils/link-routes';
import { useUserAuth } from 'src/context/auth';
import Registration from 'src/pages/registration';

const mockCurrentUserAuth = null;
// mock useUserAuth
jest.mock('src/context/auth', () => ({
  useUserAuth: jest.fn(() => ({
    user: mockCurrentUserAuth,
  })),
}));

// Mock PageLayout
jest.mock('src/components/page-layout', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <div data-testid="page-layout">{children}</div>),
}));

// Clear mocks
beforeEach(async () => {
  useUserAuth.mockImplementation(() => ({
    user: mockCurrentUserAuth,
  }));
});

it('render right initial page', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/registration']}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/registration" element={<Registration />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-registration');
  expect(page).toBeInTheDocument();

  expect(within(page).getByText(/create a new account/i)).toBeInTheDocument();

  expect(within(page).getByRole('link', { name: /sign up/i })).toHaveAttribute('href', linkRoutes.registration.signUp);

  expect(within(page).getByText('Or')).toBeInTheDocument();

  expect(within(page).getAllByTestId('avatar')).toHaveLength(2);

  expect(within(page).getByText(/Log in to your account/i)).toBeInTheDocument();

  expect(within(page).getByRole('link', { name: /log in/i })).toHaveAttribute('href', linkRoutes.registration.logIn);
});

it('Render right initial loading state', async () => {
  useUserAuth.mockImplementation(() => ({
    user: {},
  }));
  render(
    <MemoryRouter initialEntries={['/registration']}>
      <ThemeProvider theme={darkTheme}>
        <Routes>
          <Route path="/registration" element={<Registration />} />
        </Routes>
      </ThemeProvider>
      ,
    </MemoryRouter>,
  );
  await waitFor(() => {
    expect(screen.getByLabelText(/Loading.../i)).toBeInTheDocument();
  });
});

it('right classes and inline styles', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/registration']}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/registration" element={<Registration />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.getByTestId('page-registration')).toHaveClass('page page-registration');

  expect(screen.getByTestId('page-registration-grid-container')).toHaveStyle('justify-content: center; align-items: center; width: 500px; max-width: 90vw; height: 400px; padding: 8px');

  expect(screen.getAllByTestId('page-registration-grid-items')[0]).toHaveStyle('justify-content: center; align-items: center; flex-direction: column; gap: 8px');

  expect(screen.getAllByTestId('page-registration-grid-items')[1]).toHaveStyle('justify-content: center; align-items: center; flex-direction: column; gap: 8px');

  expect(screen.getAllByTestId('avatar')[0])
    .toHaveStyle(`background-color: ${darkTheme.palette.info.main}`);

  expect(screen.getAllByTestId('avatar')[1])
    .toHaveStyle(`background-color: ${darkTheme.palette.info.main}`);

  expect(screen.getByRole('link', {
    name: /sign up/i,
  })).toHaveStyle(`background-color: ${darkTheme.palette.primary.main}`);

  expect(screen.getByRole('link', {
    name: /log in/i,
  })).toHaveStyle(`background-color: ${darkTheme.palette.primary.main}`);
});
