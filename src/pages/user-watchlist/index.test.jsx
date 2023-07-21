import {
  act, render, screen, waitFor, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import userEvent from '@testing-library/user-event';
import testDbHelpers from 'src/utils/test-db-helpers';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import darkTheme from 'src/utils/darkTheme';
import ListGeneric from 'src/components/list-generic';
import Error from 'src/pages/error';
import linkRoutes from 'src/utils/link-routes';
import CardMovieMedium from 'src/components/card-movie-medium';
import { useUserAuth } from 'src/context/auth';
import { getWatchlistUser } from 'src/services/get-data';
import UserWatchlist from 'src/pages/user-watchlist';

const mockData = testDbHelpers.watchlistUser;
// mock get data service
jest.mock('src/services/get-data', () => ({
  getWatchlistUser: jest.fn(() => (Promise.resolve(mockData))),
}));

const mockCurrentUser = {
  id: mockData.user_details.id,
  username: mockData.user_details.username,
};
// mock useUserAuth
jest.mock('src/context/auth', () => ({
  useUserAuth: jest.fn(() => ({
    user: mockCurrentUser,
  })),
}));

// Mock ListGeneric
jest.mock('src/components/list-generic', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock Item
jest.mock('src/components/card-movie-medium', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock PageLayout
jest.mock('src/components/page-layout', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <div data-testid="page-layout">{children}</div>),
}));

// Clear mocks
beforeEach(async () => {
  getWatchlistUser.mockClear();
  ListGeneric.mockClear();
  useUserAuth.mockImplementation(() => ({
    user: mockCurrentUser,
  }));
});

it('render right of initial page data after loading state of user loggedIn that is the owner of the resource', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/user/${mockCurrentUser.id}/watchlist`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user/:id/watchlist" element={<UserWatchlist />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });
  expect(getWatchlistUser).toBeCalled();

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-user-watchlist');
  expect(page).toBeInTheDocument();

  const LinkUserMatcher = `see profile of ${mockData.user_details.username}`;
  const linkUser = screen.getByRole('link', {
    name: new RegExp(LinkUserMatcher, 'i'),
  });
  expect(linkUser).toBeInTheDocument();

  expect(linkUser).toHaveAttribute('href', linkRoutes.userProfile(mockCurrentUser.id));

  const h1Matcher = 'watchlist';
  expect(screen.getByRole('heading', {
    name: new RegExp(h1Matcher, 'i'),
    level: 1,
  })).toBeInTheDocument();

  expect(screen.getByText(`Total: ${mockData.total}`)).toBeInTheDocument();

  const editListLink = screen.getByRole('link', {
    name: /edit list/i,
  });
  expect(editListLink).toBeInTheDocument();
  expect(editListLink).toHaveAttribute('href', linkRoutes.watchlist);

  // Call of ListGeneric with right data and right renderItem component
  expect(ListGeneric).toHaveBeenLastCalledWith({
    list: mockData.results,
    renderItem: CardMovieMedium,
  }, {});

  expect(screen.getByRole('button', {
    name: /more/i,
  })).toBeInTheDocument();
});

it('render right of initial page data after loading state with user that is not the owner of the resource', async () => {
  useUserAuth.mockImplementation(() => ({
    user: {
      id: '1212',
      username: 'AnotherUser',
    },
  }));
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/user/${mockCurrentUser.id}/watchlist`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user/:id/watchlist" element={<UserWatchlist />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });
  expect(getWatchlistUser).toBeCalled();

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-user-watchlist');
  expect(page).toBeInTheDocument();

  // Just changed this button. This shouldn't be to any other
  // user is not the owner of the resource
  expect(screen.queryByRole('link', {
    name: /edit list/i,
  })).not.toBeInTheDocument();
});

it('Render right initial loading state', async () => {
  render(
    <MemoryRouter>
      <ThemeProvider theme={darkTheme}>
        <UserWatchlist />
      </ThemeProvider>
      ,
    </MemoryRouter>,
  );
  await waitFor(() => {
    expect(screen.getByLabelText(/Loading.../i)).toBeInTheDocument();
  });
});

it('Render the correct error page when there is any error other than 404', async () => {
  getWatchlistUser.mockImplementationOnce(() => Promise.reject(new Error('something wrong')));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/user/${mockCurrentUser.id}/watchlist`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user/:id/watchlist" element={<UserWatchlist />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });
  expect(getWatchlistUser).toBeCalled();

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  expect(screen.queryByTestId(/page-user-watchlist/i)).not.toBeInTheDocument();

  expect(screen.getByTestId(/^error-container$/i)).toBeInTheDocument();
});

it('right handle of pagintation', async () => {
  // Change mock get data service to give max only 1 item per
  // page to make more easy pagination tests. Real implementation gives max 20.

  // Fist page
  const pageOne = {
    ...mockData, page: 0, total: 2, page_zise: 1, next_page: 'next page url', results: [mockData.results[0]],
  };

  // Second Page
  const pageTwo = {
    ...mockData, page: 1, total: 2, page_zise: 1, prev_page: 'perv page url', next_page: '', results: [mockData.results[1]],
  };

  // new max data
  const newTotalResult = pageOne.results.slice().concat(pageTwo.results);

  getWatchlistUser
    .mockImplementationOnce(() => Promise.resolve(pageOne))
    .mockImplementationOnce(() => Promise.resolve(pageTwo));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/user/${mockCurrentUser.id}/watchlist`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user/:id/watchlist" element={<UserWatchlist />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-user-watchlist');
  expect(page).toBeInTheDocument();

  // The button more is not disabled when there are more data
  expect(screen.getByRole('button', {
    name: /more/i,
  })).not.toHaveAttribute('disabled');

  expect(ListGeneric).toHaveBeenLastCalledWith({
    list: pageOne.results,
    renderItem: CardMovieMedium,
  }, {});

  const user = userEvent.setup();
  const buttonMore = screen.getByRole('button', {
    name: /more/i,
  });

  await user.click(buttonMore);

  expect(ListGeneric).toHaveBeenLastCalledWith({
    list: newTotalResult,
    renderItem: CardMovieMedium,
  }, {});

  // The button more is disabled when there are not more data
  expect(await screen.findByRole('button', {
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
  getWatchlistUser
    .mockImplementationOnce(() => Promise.resolve(notLastPage));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/user/${mockCurrentUser.id}/lists/${mockData.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user/:userId/lists/:listId" element={<UserWatchlist />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.getByTestId('page-user-watchlist')).toHaveClass('page');

  expect(screen.getByTestId('page-container-button-user')).toHaveClass('page-container-button-user');

  expect(screen.getByTestId('page-container-button-more')).toHaveClass('page-container-button-more');

  expect(screen.getByTestId('page-watchlist-container-edit-button')).toHaveClass('page-watchlist-container-edit-button');

  const LinkUserMatcher = `see profile of ${mockData.user_details.username}`;
  const linkUser = screen.getByRole('link', {
    name: new RegExp(LinkUserMatcher, 'i'),
  });

  expect(linkUser).toHaveStyle(`color: ${darkTheme.palette.primary.light}`);

  const h1Matcher = 'watchlist';
  expect(screen.getByRole('heading', {
    name: new RegExp(h1Matcher, 'i'),
    level: 1,
  })).toHaveStyle(`color: ${darkTheme.palette.secondary.light}`);

  const editListLink = screen.getByRole('link', {
    name: /edit list/i,
  });

  expect(editListLink).toHaveStyle(`background-color: ${darkTheme.palette.info.main}`);

  expect(screen.getByTestId('total-results-margin')).toHaveClass('total-results-margin');

  // atribute of Button color secondary and variant contained
  expect(screen.getByRole('button', {
    name: /more/i,
  })).toHaveClass('MuiButton-containedSecondary');
});
