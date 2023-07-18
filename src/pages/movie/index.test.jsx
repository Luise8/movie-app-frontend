import {
  act, render, screen, waitFor, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import userEvent from '@testing-library/user-event';
import {
  MemoryRouter, Navigate, Route, Routes,
} from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import darkTheme from 'src/utils/darkTheme';
import Error from 'src/pages/error';
import linkRoutes from 'src/utils/link-routes';
import { useUserAuth } from 'src/context/auth';
import { getMovieDetail } from 'src/services/get-data';
import testDbHelpers from 'src/utils/test-db-helpers';
import { images, videos } from 'src/utils/tmdb-resources-url';
import Movie from 'src/pages/movie';
import ModalAddMovieToList from 'src/components/modal-add-movie-to-list';
import helperFunctions from 'src/utils/helper-functions';
import ListGridMovies from 'src/components/list-movie-grid';

const mockMovie = testDbHelpers.movieDetail;
const mockOptions = testDbHelpers.allListsUserLight;

// mock get data services
jest.mock('src/services/get-data', () => ({
  getMovieDetail: jest.fn(() => Promise.resolve(mockMovie)),
  getAllListUserLight: jest.fn(() => Promise.resolve(mockOptions)),
}));

const mockCurrentUser = {
  id: testDbHelpers.allListsUserLight.user_details.id,
  username: testDbHelpers.allListsUserLight.user_details.username,
};
// mock useUserAuth
jest.mock('src/context/auth', () => ({
  useUserAuth: jest.fn(() => ({
    user: mockCurrentUser,
  })),
}));

// mock write data service
jest.mock('src/services/list-write', () => ({
  editList: jest.fn(() => Promise.resolve('some feedback')),
}));

jest.mock('src/services/watchlist-write', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve('some feedback')),
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

// Mock modal
jest.mock('src/components/modal-add-movie-to-list');
ModalAddMovieToList.mockImplementation(jest.requireActual('src/components/modal-add-movie-to-list').default);

// mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: jest.fn(),
}));

// Clear mocks
beforeEach(async () => {
  getMovieDetail.mockClear();
  Navigate.mockClear();
  ListGridMovies.mockClear();
  useUserAuth.mockImplementation(() => ({
    user: mockCurrentUser,
  }));
});

it('render right initial page of movie with full information, after loading state of user logged', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/movie/${mockMovie.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/movie/:id" element={<Movie />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-movie');
  expect(page).toBeInTheDocument();

  const header = within(pageLayout).getByTestId('page-movie-header');
  expect(header).toBeInTheDocument();

  const containerHeaderImg = screen.getByTestId('page-movie-container-header-img');

  const headerImg = within(containerHeaderImg).getByRole('img');

  expect(headerImg).toHaveAttribute('src', images.posterSize342(mockMovie.images.posters[0].file_path));

  expect(screen.getByRole('heading', {
    name: mockMovie.title,
    level: 1,
  })).toBeInTheDocument();

  const textValueRating = mockMovie.movieDB && mockMovie.movieDB?.rateAverage ? `${mockMovie.movieDB.rateAverage}/10` : null;

  expect(screen.getByText(textValueRating)).toBeInTheDocument();

  // Rating read only
  expect(within(header).queryAllByRole('radio')).toHaveLength(0);

  const value = mockMovie.movieDB === null || !mockMovie.movieDB?.rateAverage ? 0 : 1;

  const valueWithStars = value === 1 ? '1 Star' : '0 Stars';

  expect(within(header).getByLabelText(valueWithStars)).toBeInTheDocument();

  expect(screen.getByRole('button', {
    name: 'Add to list',
  })).toBeInTheDocument();

  expect(screen.getByText(`Release: ${mockMovie.release_date}`)).toBeInTheDocument();

  expect(screen.getByText(`Duration: ${mockMovie.runtime} min`)).toBeInTheDocument();

  expect(screen.getByText(mockMovie.overview)).toBeInTheDocument();

  mockMovie.genres.forEach((genre) => {
    const genreButton = screen.getByRole('link', {
      name: genre.name,
    });

    expect(genreButton).toHaveAttribute('href', linkRoutes.movie.genre(genre.id));
  });
  expect(screen.getByTestId(/page-movie-blur-heero/i)).toBeInTheDocument();

  const sectionImages = screen.getByTestId(/page-movie-section-images/i);

  expect(within(sectionImages).getByRole('heading', {
    name: /images/i,
    level: 2,
  }));

  // The max images per group is 5.
  // The maximum number of images on screen
  // at resolution resulting from the else conditional of the breakpoints.
  expect(within(sectionImages).getAllByRole('img')).toHaveLength(5);

  const sectionVideos = screen.getByTestId(/page-movie-section-videos/i);
  expect(within(sectionVideos).getByRole('heading', {
    name: /videos/i,
    level: 2,
  }));

  // The videos don't have rendered by group.
  // So, all of the videos of the data were rendered in one single group.
  expect(within(sectionVideos).getAllByTestId('page-movie-video')).toHaveLength(mockMovie.videos.results.length);
  // Each video has the right title and src
  mockMovie.videos.results
    .forEach((video) => {
      const videoSelected = within(sectionVideos).getByTitle(video.name);
      expect(videoSelected).toBeInTheDocument();
      expect(videoSelected).toHaveAttribute('src', videos.youtube(video.key));
    });

  const sectionRates = screen.getByTestId(/page-movie-section-rates/i);
  expect(within(sectionRates).getByRole('heading', {
    name: /rates/i,
    level: 2,
  }));

  expect(within(sectionRates).getByRole('link', {
    name: /add rate/i,
  }));

  const setcionRatesRatingMatcher = mockMovie.movieDB?.rateAverage === 1
    ? '1 Star' : `${mockMovie.movieDB?.rateAverage || 0} Stars`;
  expect(within(sectionRates).getByLabelText(new RegExp(setcionRatesRatingMatcher, 'i'))).toBeInTheDocument();

  expect(within(sectionRates).getByText(`Total: ${mockMovie.movieDB.rateCount} rates`)).toBeInTheDocument();

  const sectionReviews = screen.getByTestId(/page-movie-section-reviews/i);
  expect(within(sectionReviews).getByRole('heading', {
    name: /reviews/i,
    level: 2,
  }));

  expect(within(sectionReviews).getByRole('link', {
    name: /see reviews/i,
  }));

  expect(within(sectionReviews).getByRole('link', {
    name: /add review/i,
  }));

  expect(within(sectionReviews).getByText(`Total: ${mockMovie.movieDB.reviews} reviews`)).toBeInTheDocument();

  const sectionSimilarMovies = screen.getByTestId(/page-movie-section-similar-movies/i);
  expect(within(sectionSimilarMovies).getByRole('heading', {
    name: /similar movies/i,
    level: 2,
  }));

  let groupSimilarMovies = mockMovie.similar.results.slice();
  groupSimilarMovies = helperFunctions.group(groupSimilarMovies, 5);
  // Similar movies of TMDB always return 20 movies. And
  // // The max similar movies per group is 5.
  // The maximum number of similar movies on screen
  // at resolution resulting from the else conditional of the breakpoints.
  expect(ListGridMovies).toHaveBeenCalledTimes(4);
  expect(ListGridMovies).toHaveBeenNthCalledWith(1, {
    list: groupSimilarMovies[0],
    wrap: 'noWrap',
  }, {});

  expect(ListGridMovies).toHaveBeenNthCalledWith(4, {
    list: groupSimilarMovies[3],
    wrap: 'noWrap',
  }, {});
});

it('render right initial page with full movie information, after loading state of user not logged in', async () => {
  useUserAuth.mockImplementation(() => ({
    user: null,
  }));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/movie/${mockMovie.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/movie/:id" element={<Movie />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-movie');
  expect(page).toBeInTheDocument();

  // Only change this links
  // Add to list
  expect(screen.queryByRole('button', {
    name: 'Add to list',
  })).not.toBeInTheDocument();

  const addToListButton = screen.getByRole('link', {
    name: /Go to the registration page to be able to add to the list/i,
  });
  expect(addToListButton).toBeInTheDocument();
  expect(addToListButton).toHaveAttribute('href', linkRoutes.movie.registration);

  // Rate
  expect(screen.queryByRole('link', {
    name: /add rate/i,
  })).not.toBeInTheDocument();

  const rateButton = screen.getByRole('link', {
    name: /Sign up for rating/i,
  });
  expect(rateButton).toBeInTheDocument();
  expect(rateButton).toHaveAttribute('href', linkRoutes.movie.registration);

  // Review
  expect(screen.queryByRole('link', {
    name: /add review/i,
  })).not.toBeInTheDocument();

  const reviewButton = screen.queryByRole('link', {
    name: /Sign up to review/i,
  });

  expect(reviewButton).toBeInTheDocument();
  expect(reviewButton).toHaveAttribute('href', linkRoutes.movie.registration);
});

it('render right initial page without full movie information, after loading state of user logged in', async () => {
  getMovieDetail.mockImplementationOnce(() => Promise.resolve({
    ...mockMovie, genres: [], overview: '', release_date: '', runtime: '', movieDB: null,
  }));
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/movie/${mockMovie.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/movie/:id" element={<Movie />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-movie');
  expect(page).toBeInTheDocument();

  const header = screen.getByTestId(/page-movie-header/i);
  // Only change this information

  expect(within(header).queryAllByRole('radio')).toHaveLength(0);

  const valueWithStars = '0 Stars';

  expect(within(header).getByLabelText(valueWithStars)).toBeInTheDocument();

  expect(screen.getByText(/Release: no information./i)).toBeInTheDocument();

  expect(screen.getByText('Duration: no information.')).toBeInTheDocument();

  expect(screen.getByText('No information of description.')).toBeInTheDocument();

  expect(screen.getByText('No information of genres.')).toBeInTheDocument();

  const sectionRates = screen.getByTestId(/page-movie-section-rates/i);

  const setcionRatesRatingMatcher = '0 Stars';
  expect(within(sectionRates).getByLabelText(new RegExp(setcionRatesRatingMatcher, 'i'))).toBeInTheDocument();

  expect(within(sectionRates).getByText('Total: 0 rates')).toBeInTheDocument();

  const sectionReviews = screen.getByTestId(/page-movie-section-reviews/i);

  expect(within(sectionReviews).getByText('Total: 0 reviews')).toBeInTheDocument();
});

it('ModalAddMovieToList called with right props and functions', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/movie/${mockMovie.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/movie/:id" element={<Movie />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  const user = userEvent.setup();
  const addToListButton = screen.getByRole('button', {
    name: /add to list/i,
  });

  // MODAL NOT OPEN
  expect(ModalAddMovieToList).toHaveBeenCalledWith({
    open: false,
    handleClose: expect.any(Function),
    userId: mockCurrentUser.id,
    movieId: `${mockMovie.id}`,
  }, {});

  await user.click(addToListButton);

  // Right handle open of modal fired with the button
  expect(ModalAddMovieToList).toHaveBeenCalledWith({
    open: true,
    handleClose: expect.any(Function),
    userId: mockCurrentUser.id,
    movieId: `${mockMovie.id}`,
  }, {});

  await waitFor(() => {
    expect(screen.getByText(/Select one list to add the movie/i)).toBeInTheDocument();
  });

  // Right handleClose function called with the close button
  const closeButtons = screen.getAllByRole('button', {
    name: 'close',
  });
  await user.click(closeButtons[0]);
  await waitFor(() => {
    expect(screen.queryByTestId('add-movie-to-list-dialog')).not.toBeInTheDocument();
  });
}, 10000);

it('Render right initial loading state', async () => {
  render(
    <MemoryRouter initialEntries={[`/movie/${mockMovie.id}`]}>
      <ThemeProvider theme={darkTheme}>
        <Routes>
          <Route path="/movie/:id" element={<Movie />} />
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
  getMovieDetail.mockImplementationOnce(() => Promise.reject(new Error('something wrong')));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/movie/${mockMovie.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/movie/:id" element={<Movie />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });
  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();
  expect(screen.queryByTestId(/page-movie/i)).not.toBeInTheDocument();
  expect(Navigate).toHaveBeenCalled();
  expect(Navigate).toHaveBeenCalledWith({ to: '/error' }, {});
});

it('right classes and inline styles', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/movie/${mockMovie.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/movie/:id" element={<Movie />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.getByTestId('page-movie')).toHaveClass('page');

  expect(screen.getByTestId('page-movie-header')).toHaveClass('page-movie-header');

  expect(screen.getByTestId('page-movie-container-header-img')).toHaveClass('page-movie-container-header-img');

  expect(screen.getByTestId('page-movie-container-header-info')).toHaveClass('page-movie-container-header-info');

  expect(screen.getByRole('heading', {
    name: new RegExp(mockMovie.title, 'i'),
    level: 1,
  })).toHaveStyle(`color: ${darkTheme.palette.secondary.light}`);

  expect(screen.getByTestId('page-movie-container-rating-and-add-list')).toHaveClass('page-movie-container-rating-and-add-list');

  expect(screen.getByTestId('page-movie-blur-heero')).toHaveClass('page-movie-blur-heero');

  expect(screen.getByTestId('page-movie-section-images')).toHaveClass('page-movie-section');

  const titleImagesSection = screen.getByRole('heading', {
    name: /images/i,
    level: 2,
  });
  expect(titleImagesSection).toHaveClass('section-header');
  expect(titleImagesSection).toHaveStyle(`border-left: 5px solid ${darkTheme.palette.primary.main}`);

  expect(screen.getByTestId('page-movie-section-videos')).toHaveClass('page-movie-section');

  const titleVideosSection = screen.getByRole('heading', {
    name: /videos/i,
    level: 2,
  });
  expect(titleVideosSection).toHaveClass('section-header');
  expect(titleVideosSection).toHaveStyle(`border-left: 5px solid ${darkTheme.palette.primary.main}`);

  expect(screen.getByTestId('page-movie-section-rates')).toHaveClass('page-movie-section');

  const titleRatesSection = screen.getByRole('heading', {
    name: /rates/i,
    level: 2,
  });
  expect(titleRatesSection).toHaveClass('section-header');
  expect(titleRatesSection).toHaveStyle(`border-left: 5px solid ${darkTheme.palette.primary.main}`);

  expect(screen.getByTestId('page-movie-section-rate-rating')).toHaveClass('page-movie-section-rate-rating');

  expect(screen.getByRole('link', { name: /add rate/i })).toHaveStyle(`background-color: ${darkTheme.palette.primary.main}`);

  expect(screen.getByTestId('page-movie-section-reviews')).toHaveClass('page-movie-section');

  const titleReviewsSection = screen.getByRole('heading', {
    name: /reviews/i,
    level: 2,
  });
  expect(titleReviewsSection).toHaveClass('section-header');
  expect(titleReviewsSection).toHaveStyle(`border-left: 5px solid ${darkTheme.palette.primary.main}`);

  expect(screen.getByRole('link', { name: /add review/i })).toHaveStyle(`background-color: ${darkTheme.palette.primary.main}`);
  expect(screen.getByRole('link', { name: /see reviews/i })).toHaveStyle(`background-color: ${darkTheme.palette.secondary.main}`);

  expect(screen.getByTestId('page-movie-section-similar-movies')).toHaveClass('page-movie-section');

  const titleRSimilarMovisSection = screen.getByRole('heading', {
    name: /similar movies/i,
    level: 2,
  });
  expect(titleRSimilarMovisSection).toHaveClass('section-header');
  expect(titleRSimilarMovisSection).toHaveStyle(`border-left: 5px solid ${darkTheme.palette.primary.main}`);
});
