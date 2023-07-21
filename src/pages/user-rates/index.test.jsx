import {
  act, render, screen, waitFor, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { getRatesUser } from 'src/services/get-data';
import userEvent from '@testing-library/user-event';
import testDbHelpers from 'src/utils/test-db-helpers';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import darkTheme from 'src/utils/darkTheme';
import Error from 'src/pages/error';
import linkRoutes from 'src/utils/link-routes';
import UserRates from 'src/pages/user-rates';
import CardRateUser from 'src/components/card-rate-user';

const mockCurrentUser = {
  id: '123',
  username: 'userNumber1',
};
// mock useUserAuth
jest.mock('src/context/auth', () => ({
  useUserAuth: jest.fn(() => ({
    user: mockCurrentUser,
  })),
}));

const mockData = testDbHelpers.ratesUser;
// mock get data service
jest.mock('src/services/get-data', () => ({
  getRatesUser: jest.fn(() => (Promise.resolve(mockData))),
}));

// Mock Item
jest.mock('src/components/card-rate-user', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="card-rate-user" />),
}));

// Mock PageLayout
jest.mock('src/components/page-layout', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <div data-testid="page-layout">{children}</div>),
}));

// Clear mocks
beforeEach(async () => {
  getRatesUser.mockClear();
  CardRateUser.mockClear();
});

it('render right of initial page data after loading state', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/user/${mockCurrentUser.id}/rates`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user/:id/rates" element={<UserRates />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });
  expect(getRatesUser).toBeCalled();

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-user-rates');
  expect(page).toBeInTheDocument();

  const LinkUserMatcher = `see profile of ${mockData.user_details.username}`;

  const linkUser = screen.getByRole('link', {
    name: new RegExp(LinkUserMatcher, 'i'),
  });
  expect(linkUser).toBeInTheDocument();

  expect(linkUser).toHaveAttribute('href', linkRoutes.userProfile(mockCurrentUser.id));

  expect(screen.getByRole('heading', {
    name: /rates/i,
    level: 1,
  })).toBeInTheDocument();

  expect(screen.getByText(`Total: ${mockData.results.length}`)).toBeInTheDocument();

  const cardsRateUser = screen.getAllByTestId('card-rate-user');
  expect(cardsRateUser).toHaveLength(mockData.results.length);

  expect(CardRateUser).toHaveBeenCalledWith({
    data: { ...mockData.results[0] },
  }, {});

  expect(CardRateUser).toHaveBeenLastCalledWith({
    data: { ...mockData.results[1] },
  }, {});

  expect(screen.getByRole('button', {
    name: /more/i,
  })).toBeInTheDocument();
});

it('Render right initial loading state', async () => {
  render(
    <MemoryRouter>
      <ThemeProvider theme={darkTheme}>
        <UserRates />
      </ThemeProvider>
      ,
    </MemoryRouter>,
  );
  await waitFor(() => {
    expect(screen.getByLabelText(/Loading.../i)).toBeInTheDocument();
  });
});

it('Render the correct error page when there is any error other than 404', async () => {
  getRatesUser.mockImplementationOnce(() => Promise.reject(new Error('something wrong')));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/user/${mockCurrentUser.id}/rates`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user/:id/rates" element={<UserRates />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });
  expect(getRatesUser).toBeCalled();

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  expect(screen.queryByTestId(/page-user-rates/i)).not.toBeInTheDocument();

  expect(screen.getByTestId(/^error-container$/i)).toBeInTheDocument();
});

it('right handle of pagintation', async () => {
  // Change mock get data service to give max only 1 item per
  // page to make more easy pagination tests. Real implementation gives max 20.

  // Fist page
  const pageOne = {
    ...testDbHelpers.ratesUser, page: 0, page_zise: 1, next_page: 'next page url', results: [testDbHelpers.ratesUser.results[0]],
  };

  // Second Page
  const pageTwo = {
    ...testDbHelpers.ratesUser, page: 1, page_zise: 1, prev_page: 'perv page url', next_page: '', results: [testDbHelpers.ratesUser.results[1]],
  };
  getRatesUser
    .mockImplementationOnce(() => Promise.resolve(pageOne))
    .mockImplementationOnce(() => Promise.resolve(pageTwo));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/user/${mockCurrentUser.id}/rates`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user/:id/rates" element={<UserRates />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-user-rates');
  expect(page).toBeInTheDocument();

  // The button more is not disabled when there are more data
  expect(screen.getByRole('button', {
    name: /more/i,
  })).not.toHaveAttribute('disabled');

  expect(CardRateUser).toHaveBeenCalledWith({
    data: { ...pageOne.results[0] },
  }, {});

  const user = userEvent.setup();
  const buttonMore = screen.getByRole('button', {
    name: /more/i,
  });

  await user.click(buttonMore);

  await waitFor(() => {
    expect(CardRateUser).toHaveBeenLastCalledWith({
      data: { ...pageTwo.results[0] },
    }, {});
  });

  const cardsRateUser = screen.getAllByTestId('card-rate-user');
  expect(cardsRateUser).toHaveLength(pageOne.results.length + pageTwo.results.length);

  // The button more is disabled when there are not more data
  expect(screen.getByRole('button', {
    name: /more/i,
  })).toHaveAttribute('disabled');
});

it('right classes and inline styles', async () => {
  // Change devolution of get data service
  // to test class of button more when
  // there are more resources
  const notLastPage = {
    ...mockData, next_page: 'next page url',
  };
  getRatesUser
    .mockImplementationOnce(() => Promise.resolve(notLastPage));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/user/${mockCurrentUser.id}/rates`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user/:id/rates" element={<UserRates />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.getByTestId('page-user-rates')).toHaveClass('page');

  expect(screen.getByTestId('page-container-button-user')).toHaveClass('page-container-button-user');

  expect(screen.getByTestId('page-container-button-more')).toHaveClass('page-container-button-more');

  const LinkUserMatcher = `see profile of ${mockData.user_details.username}`;
  const linkUser = screen.getByRole('link', {
    name: new RegExp(LinkUserMatcher, 'i'),
  });

  expect(linkUser).toHaveStyle(`color: ${darkTheme.palette.primary.light}`);

  expect(screen.getByRole('heading', {
    name: /rates/i,
    level: 1,
  })).toHaveStyle(`color: ${darkTheme.palette.secondary.light}`);

  expect(screen.getByTestId('total-results-margin')).toHaveClass('total-results-margin');

  // atribute of Button color secondary and variant contained
  expect(screen.getByRole('button', {
    name: /more/i,
  })).toHaveClass('MuiButton-containedSecondary');
});
