import {
  act, render, screen, waitFor, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { getReviewsUser } from 'src/services/get-data';
import userEvent from '@testing-library/user-event';
import UserReviews from 'src/pages/user-reviews';
import testDbHelpers from 'src/utils/test-db-helpers';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import darkTheme from 'src/utils/darkTheme';
import ListGeneric from 'src/components/list-generic';
import CardReviewUser from 'src/components/card-review-user';
import Error from 'src/pages/error';
import linkRoutes from 'src/utils/link-routes';

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

const mockData = testDbHelpers.reviewsUser;
// mock get data service
jest.mock('src/services/get-data', () => ({
  getReviewsUser: jest.fn(() => (Promise.resolve(mockData))),
}));

// Mock ListGeneric
jest.mock('src/components/list-generic', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock Item
jest.mock('src/components/card-review-user', () => ({
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
  getReviewsUser.mockClear();
  ListGeneric.mockClear();
});

it('render right of initial page data after loading state', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/user/${mockCurrentUser.id}/reviews`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user/:id/reviews" element={<UserReviews />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });
  expect(getReviewsUser).toBeCalled();

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-user-reviews');
  expect(page).toBeInTheDocument();

  const LinkUserMatcher = `see profile of ${mockData.user_details.username}`;
  const linkUser = screen.getByRole('link', {
    name: new RegExp(LinkUserMatcher, 'i'),
  });
  expect(linkUser).toBeInTheDocument();

  expect(linkUser).toHaveAttribute('href', linkRoutes.userProfile(mockCurrentUser.id));

  expect(screen.getByRole('heading', {
    name: /reviews/i,
    level: 1,
  })).toBeInTheDocument();

  expect(screen.getByText(`Total: ${mockData.total}`)).toBeInTheDocument();

  // Call of ListGeneric with rith data and right renderItem component
  expect(ListGeneric.mock.calls[0][0]).toEqual({
    list: mockData.results,
    propKey: 'id',
    renderItem: CardReviewUser,
  });

  expect(screen.getByRole('button', {
    name: /more/i,
  })).toBeInTheDocument();
});

it('Render right initial loading state', async () => {
  render(
    <MemoryRouter>
      <ThemeProvider theme={darkTheme}>
        <UserReviews />
      </ThemeProvider>
      ,
    </MemoryRouter>,
  );
  await waitFor(() => {
    expect(screen.getByLabelText(/Loading.../i)).toBeInTheDocument();
  });
});

it('Render the correct error page when there is any error other than 404', async () => {
  getReviewsUser.mockImplementationOnce(() => Promise.reject(new Error('something wrong')));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/user/${mockCurrentUser.id}/reviews`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user/:id/reviews" element={<UserReviews />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });
  expect(getReviewsUser).toBeCalled();

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  expect(screen.queryByTestId(/page-user-reviews/i)).not.toBeInTheDocument();

  expect(screen.getByTestId(/^error-container$/i)).toBeInTheDocument();
});

it('right handle of pagintation', async () => {
  // Change mock get data service to give max only 1 item per
  // page to make more easy pagination tests. Real implementation gives max 20.

  // Fist page
  const pageOne = {
    ...testDbHelpers.reviewsUser, page: 0, page_zise: 1, next_page: 'next page url', results: [testDbHelpers.reviewsUser.results[0]],
  };

  // Second Page
  const pageTwo = {
    ...testDbHelpers.reviewsUser, page: 1, page_zise: 1, prev_page: 'perv page url', next_page: '', results: [testDbHelpers.reviewsUser.results[1]],
  };
  getReviewsUser
    .mockImplementationOnce(() => Promise.resolve(pageOne))
    .mockImplementationOnce(() => Promise.resolve(pageTwo));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/user/${mockCurrentUser.id}/reviews`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user/:id/reviews" element={<UserReviews />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-user-reviews');
  expect(page).toBeInTheDocument();

  // The button more is not disabled when there are more data
  expect(screen.getByRole('button', {
    name: /more/i,
  })).not.toHaveAttribute('disabled');

  expect(ListGeneric.mock.calls[0][0]).toEqual({
    list: pageOne.results,
    propKey: 'id',
    renderItem: CardReviewUser,
  });

  const user = userEvent.setup();
  const buttonMore = screen.getByRole('button', {
    name: /more/i,
  });

  await user.click(buttonMore);

  /// console.log(ListGeneric.mock.calls);
  await waitFor(() => {
    expect(ListGeneric).toHaveBeenLastCalledWith({
      list: testDbHelpers.reviewsUser.results,
      propKey: 'id',
      renderItem: CardReviewUser,
    }, {});
  });

  // The button more is disabled when there are not more data
  expect(screen.getByRole('button', {
    name: /more/i,
  })).toHaveAttribute('disabled');
});

it('right classes and inline styles', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/user/${mockCurrentUser.id}/reviews`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/user/:id/reviews" element={<UserReviews />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.getByTestId('page-user-reviews')).toHaveClass('page');

  expect(screen.getByTestId('page-container-button-user')).toHaveClass('page-container-button-user');

  expect(screen.getByTestId('page-container-button-more')).toHaveClass('page-container-button-more');

  const LinkUserMatcher = `see profile of ${mockData.user_details.username}`;
  const linkUser = screen.getByRole('link', {
    name: new RegExp(LinkUserMatcher, 'i'),
  });

  expect(linkUser).toHaveStyle(`color: ${darkTheme.palette.primary.light}`);

  expect(screen.getByRole('heading', {
    name: /reviews/i,
    level: 1,
  })).toHaveStyle(`color: ${darkTheme.palette.secondary.light}`);

  // atribute of Button color secondary and variant outlined
  expect(screen.getByRole('button', {
    name: /more/i,
  })).toHaveClass('MuiButton-outlinedSecondary');
});
