import {
  act, render, screen, waitFor, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import {
  MemoryRouter, Navigate, Route, Routes,
} from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import darkTheme from 'src/utils/darkTheme';
import Error from 'src/pages/error';
import linkRoutes from 'src/utils/link-routes';
import { useUserAuth } from 'src/context/auth';
import { getUser } from 'src/services/get-data';
import testDbHelpers from 'src/utils/test-db-helpers';
import ListGeneric from 'src/components/list-generic';
import ListMovieLists from 'src/components/list-movie-lists';
import CardReviewUser from 'src/components/card-review-user';
import CardRateUser from 'src/components/card-rate-user';
import User from 'src/pages/user';
import appResourcesPath from 'src/utils/app-resources-path';

const mockUserProfile = testDbHelpers.users.userFullData;

// mock get data services
jest.mock('src/services/get-data', () => ({
  getUser: jest.fn(() => Promise.resolve(mockUserProfile)),
}));

const mockCurrentUserAuth = {
  id: mockUserProfile.id,
  username: mockUserProfile.username,
};
// mock useUserAuth
jest.mock('src/context/auth', () => ({
  useUserAuth: jest.fn(() => ({
    user: mockCurrentUserAuth,
  })),
}));

// Mock list components
jest.mock('src/components/list-movie-lists', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock ListGeneric
jest.mock('src/components/list-generic', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock Items
jest.mock('src/components/card-review-user', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('src/components/card-rate-user', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="card-rate-user" />),
}));

// Mock PageLayout
jest.mock('src/components/page-layout', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <div data-testid="page-layout">{children}</div>),
}));

// mock Navigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: jest.fn(),
}));

// Clear mocks
beforeEach(async () => {
  getUser.mockClear();
  Navigate.mockClear();
  ListMovieLists.mockClear();
  ListGeneric.mockClear();
  CardRateUser.mockClear();
  CardReviewUser.mockClear();
  useUserAuth.mockImplementation(() => ({
    user: mockCurrentUserAuth,
  }));
});

it('render right initial page of user with full information, after loading state of current user logged in that is the owner of the account', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/user/${mockUserProfile.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user/:id" element={<User />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-user');
  expect(page).toBeInTheDocument();

  const header = within(pageLayout).getByTestId('page-user-header');

  expect(header).toBeInTheDocument();

  const mainHeader = within(header).getByTestId(/page-user-header-main/i);

  const containerHeaderImg = within(mainHeader).getByTestId('page-user-container-photo-profile');

  const headerImg = within(containerHeaderImg).getByRole('img');

  expect(headerImg).toHaveAttribute('src', mockUserProfile.photo);

  expect(within(mainHeader).getByText(mockUserProfile.username)).toBeInTheDocument();

  const date = `Member since: ${new Date(mockUserProfile.date).toUTCString()}`;
  expect(within(mainHeader)
    .getByText((content, element) => element.textContent === date)).toBeInTheDocument();

  const bio = `Bio: ${mockUserProfile.bio}`;
  expect(within(mainHeader)
    .getByText((content, element) => element.textContent === bio)).toBeInTheDocument();

  const asideHeader = within(header).getByTestId(/page-user-header-aside/i);

  expect(within(asideHeader).getByRole('link', {
    name: /lists/i,
  })).toHaveAttribute('href', linkRoutes.user.lists(mockUserProfile.id));

  expect(within(asideHeader).getByRole('link', {
    name: /rates/i,
  })).toHaveAttribute('href', linkRoutes.user.rates(mockUserProfile.id));

  expect(within(asideHeader).getByRole('link', {
    name: /reviews/i,
  })).toHaveAttribute('href', linkRoutes.user.reviews(mockUserProfile.id));

  expect(within(asideHeader).getByRole('link', {
    name: /watchlist/i,
  })).toHaveAttribute('href', linkRoutes.user.watchlist(mockUserProfile.id));

  expect(within(asideHeader).getByRole('link', {
    name: /edit profile/i,
  })).toHaveAttribute('href', linkRoutes.user.editUser);

  expect(screen.getByRole('heading', {
    name: /Latest from user/,
    level: 1,
  })).toBeInTheDocument();

  const sectionLists = screen.getByTestId(/page-user-section-lists/i);

  expect(within(sectionLists).getByRole('link', {
    name: /lists/i,
  })).toHaveAttribute('href', linkRoutes.user.lists(mockUserProfile.id));

  // Call of ListMovieLists with right data
  expect(ListMovieLists).toHaveBeenLastCalledWith({
    list: mockUserProfile.lists,
  }, {});

  const sectionRates = screen.getByTestId(/page-user-section-rates/i);

  expect(within(sectionRates).getByRole('link', {
    name: /rates/i,
  })).toHaveAttribute('href', linkRoutes.user.rates(mockUserProfile.id));

  expect(CardRateUser).toHaveBeenCalledTimes(mockUserProfile.rates.length);
  mockUserProfile.rates.forEach((rate) => {
    expect(CardRateUser).toHaveBeenCalledWith({
      data: rate,
    }, {});
  });

  const sectionreviews = screen.getByTestId(/page-user-section-reviews/i);

  expect(within(sectionreviews).getByRole('link', {
    name: /reviews/i,
  })).toHaveAttribute('href', linkRoutes.user.reviews(mockUserProfile.id));

  // Call of ListGeneric with rith data and right renderItem component
  expect(ListGeneric).toHaveBeenCalledWith({
    list: mockUserProfile.reviews,
    propKey: 'id',
    renderItem: CardReviewUser,
  }, {});
});

it('render right initial page of user with full information, after loading state of current user not logged in', async () => {
  useUserAuth.mockImplementation(() => ({
    user: null,
  }));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/user/${mockUserProfile.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user/:id" element={<User />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  const header = screen.getByTestId('page-user-header');

  const asideHeader = within(header).getByTestId(/page-user-header-aside/i);

  // Only change this links
  expect(within(asideHeader).queryByRole('link', {
    name: /watchlist/i,
  })).not.toBeInTheDocument();

  expect(within(asideHeader).queryByRole('link', {
    name: /edit profile/i,
  })).not.toBeInTheDocument();
});

it('render right initial page of user without full  information, after loading state of user logged in that is the owner of the account', async () => {
  getUser.mockImplementationOnce(() => Promise.resolve(testDbHelpers.users.userWithoutData));
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/user/${testDbHelpers.users.userWithoutData.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user/:id" element={<User />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-user');
  expect(page).toBeInTheDocument();

  const header = within(pageLayout).getByTestId('page-user-header');

  expect(header).toBeInTheDocument();

  const mainHeader = within(header).getByTestId(/page-user-header-main/i);

  const containerHeaderImg = within(mainHeader).getByTestId('page-user-container-photo-profile');

  const headerImg = within(containerHeaderImg).getByRole('img');

  // The img change to the default
  expect(headerImg).toHaveAttribute('src', appResourcesPath.userDefaultIcon);

  // The bio is not in the document
  expect(within(header).queryByText(/bio/i)).not.toBeInTheDocument();

  // Sections
  const sectionLists = screen.getByTestId(/page-user-section-lists/i);

  expect(within(sectionLists).getByText(/There are not activity./i)).toBeInTheDocument();
  expect(ListMovieLists).not.toHaveBeenCalled();

  const sectionRates = screen.getByTestId(/page-user-section-rates/i);

  expect(within(sectionRates).getByText(/There are not activity./i)).toBeInTheDocument();
  expect(CardRateUser).not.toHaveBeenCalled();

  const sectionReviews = screen.getByTestId(/page-user-section-reviews/i);

  expect(within(sectionReviews).getByText(/There are not activity./i)).toBeInTheDocument();
  expect(ListGeneric).not.toHaveBeenCalled();
});

it('Render right initial loading state', async () => {
  render(
    <MemoryRouter initialEntries={[`/user/${mockUserProfile.id}`]}>
      <ThemeProvider theme={darkTheme}>
        <Routes>
          <Route path="/user/:id" element={<User />} />
        </Routes>
      </ThemeProvider>
      ,
    </MemoryRouter>,
  );
  await waitFor(() => {
    expect(screen.getByLabelText(/Loading.../i)).toBeInTheDocument();
  });
});

it('Render the correct error page when there is any error other than 404', async () => {
  getUser.mockImplementationOnce(() => Promise.reject(new Error('something wrong')));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/user/${mockUserProfile.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user/:id" element={<User />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });
  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();
  expect(screen.queryByTestId(/page-user/i)).not.toBeInTheDocument();
  expect(Navigate).toHaveBeenCalled();
  expect(Navigate).toHaveBeenCalledWith({ to: '/error' }, {});
});

it('right classes and inline styles', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/user/${mockUserProfile.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user/:id" element={<User />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.getByTestId('page-user')).toHaveClass('page page-user');

  expect(screen.getByTestId('page-user-header')).toHaveStyle('display: flex; column-gap: 8px; row-gap: 24px; align-items: flex-start; justify-content: space-between');

  expect(screen.getByTestId(/page-user-header-main/i))
    .toHaveStyle('display: flex; word-break: break-word');

  expect(screen.getByTestId('page-user-container-photo-profile')).toHaveClass('page-user-container-photo-profile');

  const headerAside = screen.getByTestId('page-user-header-aside');
  expect(headerAside).toHaveClass('page-user-header-aside');

  expect(headerAside).toHaveStyle('display: flex; align-items: flex-start; flex-direction: column; gap: 8px');

  expect(within(headerAside).getByRole('link', {
    name: /lists/i,
  })).toHaveStyle(`color: ${darkTheme.palette.primary.light}`);
  expect(within(headerAside).getByRole('link', {
    name: /rates/i,
  })).toHaveStyle(`color: ${darkTheme.palette.primary.light}`);
  expect(within(headerAside).getByRole('link', {
    name: /edit profile/i,
  })).toHaveStyle(`color: ${darkTheme.palette.primary.light}`);
  expect(within(headerAside).getByRole('link', {
    name: /reviews/i,
  })).toHaveStyle(`color: ${darkTheme.palette.primary.light}`);
  expect(within(headerAside).getByRole('link', {
    name: /watchlist/i,
  })).toHaveStyle(`color: ${darkTheme.palette.primary.light}`);
});
