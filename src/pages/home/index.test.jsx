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
import { useUserAuth } from 'src/context/auth';
import {
  getLatestMovies, getPopularMovies, getRatedMovies, getTrendingMovies,
} from 'src/services/get-data';
import testDbHelpers from 'src/utils/test-db-helpers';
import helperFunctions from 'src/utils/helper-functions';
import ListGridMovies from 'src/components/list-movie-grid';
import Home from 'src/pages/home';

const mockPopular = testDbHelpers.moviesPopular;
const mockLatest = testDbHelpers.moviesLatest;
const mockTrending = testDbHelpers.moviesTrending;
const mockRated = testDbHelpers.moviesRated;

// mock get data services
jest.mock('src/services/get-data', () => ({
  getPopularMovies: jest.fn(() => Promise.resolve(mockPopular)),
  getLatestMovies: jest.fn(() => Promise.resolve(mockLatest)),
  getTrendingMovies: jest.fn(() => Promise.resolve(mockTrending)),
  getRatedMovies: jest.fn(() => Promise.resolve(mockRated)),
}));

const mockCurrentUser = {
  id: testDbHelpers.users.userFullData.id,
  username: testDbHelpers.users.userFullData.username,
};
// mock useUserAuth
jest.mock('src/context/auth', () => ({
  useUserAuth: jest.fn(() => ({
    user: mockCurrentUser,
  })),
}));

// Mock list component
jest.mock('src/components/list-movie-grid', () => ({
  __esModule: true,
  default: jest.fn(),
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
  getPopularMovies.mockClear();
  getLatestMovies.mockClear();
  getTrendingMovies.mockClear();
  getRatedMovies.mockClear();
  Navigate.mockClear();
  ListGridMovies.mockClear();
  useUserAuth.mockImplementation(() => ({
    user: mockCurrentUser,
  }));
});

it('render right initial page of movie with full information, after loading state of user logged', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-home');
  expect(page).toBeInTheDocument();

  const header = within(page).getByTestId('page-home-header');
  expect(header).toBeInTheDocument();

  // Right number of items of header carousel
  const itemsHeaderCarrousel = screen.getAllByTestId(/page-home-container-img-header/i);
  expect(itemsHeaderCarrousel).toHaveLength(4);

  // Right items of header carousel rendered, title and image
  // This takes the first 4 movies of trending movies
  const headerMovies = mockTrending.results.slice(0, 4);
  const imagesHeaderCarousel = within(header).getAllByRole('img');
  // Only one image of carousel in the document
  expect(imagesHeaderCarousel).toHaveLength(1);

  // All of the titles in the document
  headerMovies.forEach((item) => {
    expect(screen.getByText(item.title)).toBeInTheDocument();
  });

  // Only one element is visible at the time, and the first element is the initial item visible
  expect(screen.getByText(headerMovies[0].title)).toBeVisible();
  expect(imagesHeaderCarousel[0]).toBeVisible();

  headerMovies.forEach((item, i) => {
    if (i === 0) return;
    expect(screen.getByText(item.title)).not.toBeVisible();
  });

  expect(screen.getByText(/Trending today/i)).toBeInTheDocument();

  // Section
  const sectionPopular = screen.getByTestId(/page-home-section-popular/i);
  expect(within(sectionPopular).getByRole('link', {
    name: /popular/i,
  }));

  let groupPopular = mockPopular.results.slice();
  groupPopular = helperFunctions.group(groupPopular, 5);
  // popular movies always return 20 movies. And
  // // The max popular movies per group is 5,
  // the maximum number of popular movies on screen
  // at resolution resulting from the else conditional of the breakpoints.

  groupPopular.forEach((movie, i) => {
    expect(ListGridMovies).toHaveBeenNthCalledWith(i + 1, {
      list: groupPopular[i],
      wrap: 'noWrap',
    }, {});
  });

  // Section
  const sectionLatest = screen.getByTestId(/page-home-section-latest/i);
  expect(within(sectionLatest).getByRole('link', {
    name: /latest/i,
  }));

  let groupLatest = mockLatest.results.slice();
  groupLatest = helperFunctions.group(groupLatest, 5);
  // latest movies always return 20 movies. And
  // // The max latest movies per group is 5,
  // the maximum number of latest movies on screen
  // at resolution resulting from the else conditional of the breakpoints.

  groupLatest.forEach((movie, i) => {
    expect(ListGridMovies).toHaveBeenNthCalledWith(i + 5, {
      list: groupLatest[i],
      wrap: 'noWrap',
    }, {});
  });

  // Section
  const sectionTrending = screen.getByTestId(/page-home-section-trending/i);
  expect(within(sectionTrending).getByRole('link', {
    name: /trending/i,
  }));

  let groupTrending = mockTrending.results.slice();
  groupTrending = helperFunctions.group(groupTrending, 5);
  // trending movies always return 20 movies. And
  // // The max trending movies per group is 5,
  // the maximum number of trending movies on screen
  // at resolution resulting from the else conditional of the breakpoints.

  groupTrending.forEach((movie, i) => {
    expect(ListGridMovies).toHaveBeenNthCalledWith(i + 9, {
      list: groupTrending[i],
      wrap: 'noWrap',
    }, {});
  });

  // Section
  const sectionRated = screen.getByTestId(/page-home-section-rated/i);
  expect(within(sectionRated).getByRole('link', {
    name: /rated/i,
  }));

  let groupRated = mockRated.results.slice();
  groupRated = helperFunctions.group(groupRated, 5);
  // rated movies always return max 20 movies and min
  // 0 because they depend on user rates and not on tmdb.
  // And The max rated movies per group is 5,
  // the maximum number of rated movies on screen
  // at resolution resulting from the else conditional of the breakpoints.

  groupRated.forEach((movie, i) => {
    expect(ListGridMovies).toHaveBeenNthCalledWith(i + 13, {
      list: groupRated[i],
      wrap: 'noWrap',
    }, {});
  });
});

it('Render right initial loading state', async () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <ThemeProvider theme={darkTheme}>
        <Routes>
          <Route path="/" element={<Home />} />
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
  getPopularMovies.mockImplementationOnce(() => Promise.reject(new Error('something wrong')));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });
  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();
  expect(screen.queryByTestId(/page-home/i)).not.toBeInTheDocument();
  expect(Navigate).toHaveBeenCalled();
  expect(Navigate).toHaveBeenCalledWith({ to: '/error' }, {});
});

it('right classes and inline styles', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.getByTestId('page-home')).toHaveClass('page page-home');

  expect(screen.getByTestId('page-home-header')).toHaveClass('page-home-header');

  const containerTitleMovieHeader = screen.getAllByTestId('page-home-container-title-movie-header');
  expect(containerTitleMovieHeader[0]).toHaveClass('page-home-container-title-movie-header');

  expect(screen.getByRole('heading', {
    name: mockTrending.results[0].title,
    level: 2,
  })).toHaveStyle(`color: ${darkTheme.palette.text.primary}`);

  expect(screen.getByTestId('page-home-cover-header')).toHaveClass('page-home-cover-header');

  expect(screen.getByRole('heading', {
    name: /trending today/i,
    level: 1,
  })).toHaveStyle(`color: ${darkTheme.palette.text.secondary}`);

  const titlePopularSection = screen.getByRole('link', {
    name: /popular/i,
  });

  expect(titlePopularSection).toHaveClass('section-header');
  expect(titlePopularSection).toHaveStyle(`border-left: 5px solid ${darkTheme.palette.primary.main}`);

  const containerItemsSection = screen.getAllByTestId('page-home-container-items');
  expect(containerItemsSection[0]).toHaveClass('page-home-container-items');

  const titleLatestSection = screen.getByRole('link', {
    name: /latest/i,
  });

  expect(titleLatestSection).toHaveClass('section-header');
  expect(titleLatestSection).toHaveStyle(`border-left: 5px solid ${darkTheme.palette.primary.main}`);

  const titleTrendingSection = screen.getByRole('link', {
    name: /trending/i,
  });

  expect(titleTrendingSection).toHaveClass('section-header');
  expect(titleTrendingSection).toHaveStyle(`border-left: 5px solid ${darkTheme.palette.primary.main}`);

  const titleRatedSection = screen.getByRole('link', {
    name: /Rated by the comunity/i,
  });

  expect(titleRatedSection).toHaveClass('section-header');
  expect(titleRatedSection).toHaveStyle(`border-left: 5px solid ${darkTheme.palette.primary.main}`);
});
