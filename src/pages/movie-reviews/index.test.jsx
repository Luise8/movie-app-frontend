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
import Error from 'src/pages/error';
import { useUserAuth } from 'src/context/auth';
import MovieReviews from 'src/pages/movie-reviews';
import { getReviewsMovie } from 'src/services/get-data';
import CardReviewMovie from 'src/components/card-review-movie';
import ListGeneric from 'src/components/list-generic';
import linkRoutes from 'src/utils/link-routes';

const mockData = testDbHelpers.reviewsMovie;
// mock get data service
jest.mock('src/services/get-data', () => ({
  getReviewsMovie: jest.fn(() => (Promise.resolve(mockData))),
}));

const mockCurrentUser = {
  id: '123',
  username: 'SomeUser123',
};
// mock useUserAuth
jest.mock('src/context/auth', () => ({
  useUserAuth: jest.fn(() => ({
    user: mockCurrentUser,
  })),
}));

// Mock list component
jest.mock('src/components/list-generic', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock Item
jest.mock('src/components/card-review-movie', () => ({
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
  getReviewsMovie.mockClear();
  ListGeneric.mockClear();
  CardReviewMovie.mockClear();
  useUserAuth.mockClear();
});

it('render right of initial page data after loading state', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/movie/${mockData.movie_details.idTMDB}/reviews`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/movie/:id/reviews" element={<MovieReviews />} />
          </Routes>
        </ThemeProvider>
      </MemoryRouter>,
    );
  });
  expect(getReviewsMovie).toBeCalled();

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-movie-reviews');
  expect(page).toBeInTheDocument();

  const dateToTitle = mockData.movie_details.release_date && typeof mockData.movie_details.release_date === 'string' ? ` (${mockData.movie_details.release_date.slice(0, 4)})` : '';
  const titleMovieMatcher = `${mockData.movie_details.name}${dateToTitle}`;
  const titleMovie = screen.getByRole('link', {
    name: titleMovieMatcher,
  });
  expect(titleMovie).toBeInTheDocument();
  expect(titleMovie).toHaveAttribute('href', linkRoutes.reviewsMovie(mockData.movie_details.idTMDB));

  const h1Matcher = 'reviews';
  expect(screen.getByRole('heading', {
    name: new RegExp(h1Matcher, 'i'),
    level: 1,
  })).toBeInTheDocument();

  const imgMovie = screen.getByRole('img', {
    name: mockData.movie_details.name,
  });
  expect(imgMovie).toBeInTheDocument();

  const containerImgLink = screen.getByTestId('page-movie-reviews-container-img');
  expect(containerImgLink).toBeInTheDocument();
  expect(containerImgLink).toHaveAttribute('href', linkRoutes.reviewsMovie(mockData.movie_details.idTMDB));

  expect(screen.getByText(`Total: ${mockData.total}`)).toBeInTheDocument();

  // Call of ListGeneric with right data
  expect(ListGeneric).toHaveBeenLastCalledWith({
    list: mockData.results,
    renderItem: CardReviewMovie,
    propKey: 'id',
  }, {});

  expect(screen.getByRole('button', {
    name: /more/i,
  })).toBeInTheDocument();
});

it('Render right initial loading state', async () => {
  render(
    <MemoryRouter>
      <ThemeProvider theme={darkTheme}>
        <MovieReviews />
      </ThemeProvider>
    </MemoryRouter>,
  );
  await waitFor(() => {
    expect(screen.getByLabelText(/Loading.../i)).toBeInTheDocument();
  });
});

it('Render the correct error page when there is any error other than 404', async () => {
  getReviewsMovie.mockImplementationOnce(() => Promise.reject(new Error('something wrong')));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/movie/${mockData.movie_details.idTMDB}/reviews`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/movie/:id/reviews" element={<MovieReviews />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </ThemeProvider>
      </MemoryRouter>,
    );
  });
  expect(getReviewsMovie).toBeCalled();

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  expect(screen.queryByTestId(/page-movie-reviews/i)).not.toBeInTheDocument();

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

  getReviewsMovie
    .mockImplementationOnce(() => Promise.resolve(pageOne))
    .mockImplementationOnce(() => Promise.resolve(pageTwo));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/movie/${mockData.movie_details.idTMDB}/reviews`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/movie/:id/reviews" element={<MovieReviews />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </ThemeProvider>
      </MemoryRouter>,
    );
  });

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-movie-reviews');
  expect(page).toBeInTheDocument();

  // The button more is not disabled when there are more data
  expect(screen.getByRole('button', {
    name: /more/i,
  })).not.toHaveAttribute('disabled');

  expect(ListGeneric).toHaveBeenLastCalledWith({
    list: pageOne.results,
    renderItem: CardReviewMovie,
    propKey: 'id',
  }, {});

  const user = userEvent.setup();
  const buttonMore = screen.getByRole('button', {
    name: /more/i,
  });

  await user.click(buttonMore);

  expect(ListGeneric).toHaveBeenLastCalledWith({
    list: newTotalResult,
    renderItem: CardReviewMovie,
    propKey: 'id',
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
  getReviewsMovie
    .mockImplementationOnce(() => Promise.resolve(notLastPage));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/movie/${mockData.movie_details.idTMDB}/reviews`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/movie/:id/reviews" element={<MovieReviews />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.getByTestId('page-movie-reviews')).toHaveClass('page');

  const dateToTitle = mockData.movie_details.release_date && typeof mockData.movie_details.release_date === 'string' ? ` (${mockData.movie_details.release_date.slice(0, 4)})` : '';
  const titleMovieMatcher = `${mockData.movie_details.name}${dateToTitle}`;
  const titleMovie = screen.getByRole('link', {
    name: titleMovieMatcher,
  });
  expect(titleMovie).toHaveClass('page-movie-reviews-movie-title');
  expect(titleMovie).toHaveStyle(`color: ${darkTheme.palette.primary.main}`);

  const h1Matcher = 'reviews';
  expect(screen.getByRole('heading', {
    name: new RegExp(h1Matcher, 'i'),
    level: 1,
  })).toHaveStyle(`color: ${darkTheme.palette.secondary.light}`);

  expect(screen.getByTestId('page-movie-reviews-container-img')).toHaveClass('page-movie-reviews-container-img');

  expect(screen.getByTestId('total-results-margin')).toHaveClass('total-results-margin');

  // atribute of Button color secondary and variant contained
  expect(screen.getByRole('button', {
    name: /more/i,
  })).toHaveClass('MuiButton-containedSecondary');
});
