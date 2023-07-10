import {
  act, render, screen, waitFor, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import userEvent from '@testing-library/user-event';
import {
  MemoryRouter, Route, Routes,
} from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import darkTheme from 'src/utils/darkTheme';
import Error from 'src/pages/error';
import linkRoutes from 'src/utils/link-routes';
import { useUserAuth } from 'src/context/auth';
import ModalNotification from 'src/components/modal-notification';
import { getMovieTmdb, getSpecificReviewUser } from 'src/services/get-data';
import testDbHelpers from 'src/utils/test-db-helpers';
import { createReview, editReview } from 'src/services/review-write';
import ReviewForm from 'src/pages/review-form';
import { images } from 'src/utils/tmdb-resources-url';

const mockMovieTMDB = testDbHelpers.movieTMDB;
const reviewCreated = testDbHelpers.specificReviewUser;
const newReview = {
  title: 'Lorem ipsum dolo',
  body: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a',
};

// mock get data services
jest.mock('src/services/get-data', () => ({
  getSpecificReviewUser: jest.fn(() => Promise.resolve({
    review: null,
  })),
  getMovieTmdb: jest.fn(() => Promise.resolve(mockMovieTMDB)),
}));

const mockCurrentUser = {
  id: reviewCreated.review.userId,
  username: 'userNumber2',
};
// mock useUserAuth
jest.mock('src/context/auth', () => ({
  useUserAuth: jest.fn(() => ({
    user: mockCurrentUser,
  })),
}));

// mock write data service
jest.mock('src/services/review-write', () => ({
  createReview: jest.fn(() => Promise.resolve('some feedback')),
  editReview: jest.fn(() => Promise.resolve('some feedback')),
}));

// Mock PageLayout
jest.mock('src/components/page-layout', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <div data-testid="page-layout">{children}</div>),
}));

// Mock modal
jest.mock('src/components/modal-notification');
ModalNotification.mockImplementation(jest.requireActual('src/components/modal-notification').default);

// mock useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

// Clear mocks
beforeEach(async () => {
  getSpecificReviewUser.mockClear();
  getMovieTmdb.mockClear();
  createReview.mockClear();
  editReview.mockClear();
  ModalNotification.mockClear();
  mockedUsedNavigate.mockClear();
  useUserAuth.mockImplementation(() => ({
    user: mockCurrentUser,
  }));
});

it('render right of initial page data after loading state of user logged in that have not reviewed the movie yet', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/review-form/${mockMovieTMDB.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/review-form/:movieId" element={<ReviewForm />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-review-form');
  expect(page).toBeInTheDocument();

  const releaseDate = mockMovieTMDB.release_date && typeof mockMovieTMDB.release_date === 'string' ? ` (${mockMovieTMDB.release_date.slice(0, 4)})` : '';
  const userReviewsLinkMatcher = `${mockMovieTMDB.title}${releaseDate}`;
  const userReviewsLink = screen.getByRole('link', {
    name: userReviewsLinkMatcher,
  });
  expect(userReviewsLink).toHaveAttribute('href', linkRoutes.reviewForm.movie(mockMovieTMDB.id));

  const containerImage = screen.getByTestId('page-review-form-container-img');
  expect(containerImage).toHaveAttribute('href', linkRoutes.reviewForm.movie(mockMovieTMDB.id));

  const img = within(containerImage).getByRole('img', {
    name: mockMovieTMDB.title,
  });

  expect(img).toHaveAttribute('src', images.posterSize154(mockMovieTMDB.poster_path));

  const h1Matcher = 'your review';
  expect(screen.getByRole('heading', {
    name: new RegExp(h1Matcher, 'i'),
    level: 1,
  })).toBeInTheDocument();

  const inptuTitle = screen.getByRole('textbox', {
    name: /title/i,
  });
  expect(inptuTitle).toHaveValue('');
  expect(inptuTitle).toHaveFocus();

  const labelTitle = screen.getByLabelText(/title/i);
  expect(labelTitle).toBeInTheDocument();

  const usernameHelperText = screen.getByTestId(/title-restrictions/i);
  expect(usernameHelperText).toHaveTextContent('Only letters, numbers, spaces, and the following special characters are allowed, not including parentheses (- \' . ? ,). The length must be between 12 and 175 characters.');

  const inputBody = screen.getByRole('textbox', {
    name: /body/i,
  });
  expect(inputBody).toHaveValue('');

  const labelBody = screen.getByLabelText(/body/i);
  expect(labelBody).toBeInTheDocument();

  const bodyHelperText = screen.getByTestId(/body-restrictions/i);
  expect(bodyHelperText).toHaveTextContent('Only letters, numbers, spaces, and the following special characters are allowed, not including parentheses (- \' . ? ,). The length must be between 400 and 10000 characters.');

  const saveButton = screen.getByRole('button', {
    name: /save/i,
  });
  expect(saveButton).toBeInTheDocument();
});

it('render right of initial page data after loading state of user logged in that already have reviewed the movie', async () => {
  getSpecificReviewUser.mockImplementationOnce(() => Promise.resolve(reviewCreated));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/review-form/${mockMovieTMDB.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/review-form/:movieId" element={<ReviewForm />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-review-form');
  expect(page).toBeInTheDocument();

  // Only change these fields
  const inptuTitle = screen.getByRole('textbox', {
    name: /title/i,
  });
  expect(inptuTitle).toHaveValue(reviewCreated.title);
  expect(inptuTitle).toHaveFocus();

  const labelTitle = screen.getByLabelText(/title/i);
  expect(labelTitle).toBeInTheDocument();

  const inputBody = screen.getByRole('textbox', {
    name: /body/i,
  });
  expect(inputBody).toHaveValue(reviewCreated.body);
});

it('Render right initial loading state', async () => {
  useUserAuth.mockImplementation(() => ({
    user: {},
  }));
  render(
    <MemoryRouter>
      <ThemeProvider theme={darkTheme}>
        <ReviewForm />
      </ThemeProvider>
      ,
    </MemoryRouter>,
  );
  await waitFor(() => {
    expect(screen.getByLabelText(/Loading.../i)).toBeInTheDocument();
  });
});

it('right handle of creation of review', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/review-form/${mockMovieTMDB.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/review-form/:movieId" element={<ReviewForm />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-review-form');
  expect(page).toBeInTheDocument();

  // The modal is not in the document
  expect(screen.queryByTestId('notification-dialog')).not.toBeInTheDocument();

  const inptuTitle = screen.getByRole('textbox', {
    name: /title/i,
  });
  const inputBody = screen.getByRole('textbox', {
    name: /body/i,
  });

  // The data initial is right
  expect(inptuTitle).toHaveValue('');
  expect(inputBody).toHaveValue('');

  const user = userEvent.setup();

  // Change title, this input is already focus
  await user.type(inptuTitle, newReview.title);
  expect(screen.getByRole('textbox', {
    name: /title/i,
  })).toHaveValue(newReview.title);

  // Change body
  act(() => {
    inputBody.focus();
  });
  await user.type(inputBody, newReview.body);
  expect(screen.getByRole('textbox', {
    name: /body/i,
  })).toHaveValue(newReview.body);

  // Right function handleSave
  // Save the changes
  await user.click(screen.getByRole('button', {
    name: /save/i,
  }));

  // Modal notification called with right props
  await waitFor(() => {
    expect(screen.getByTestId('notification-dialog')).toBeInTheDocument();
  });

  expect(ModalNotification).toHaveBeenLastCalledWith({
    open: true,
    title: 'Success',
    body: 'The operation was carried out successfully.',
    handleClose: expect.any(Function),
  }, {});

  // close modal
  await user.click(within(screen.getByTestId('notification-dialog')).getByRole('button', {
    name: /close/i,
  }));

  await waitFor(() => {
    expect(screen.queryByTestId('notification-dialog')).not.toBeInTheDocument();
  });

  // Call to the service with right arguments
  expect(createReview).toHaveBeenCalledWith({
    title: newReview.title,
    body: newReview.body,
    id: `${mockMovieTMDB.id}`,
  });

  // Redirection to right route
  expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
  expect(mockedUsedNavigate)
    .toHaveBeenCalledWith(linkRoutes.reviewForm.reviews(mockCurrentUser.id));
}, 100000);

it('call of right function to handle edition of review', async () => {
  getSpecificReviewUser.mockImplementationOnce(() => Promise.resolve(reviewCreated));
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/review-form/${mockMovieTMDB.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/review-form/:movieId" element={<ReviewForm />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-review-form');
  expect(page).toBeInTheDocument();

  // The modal is not in the document
  expect(screen.queryByTestId('notification-dialog')).not.toBeInTheDocument();

  const inptuTitle = screen.getByRole('textbox', {
    name: /title/i,
  });
  const inputBody = screen.getByRole('textbox', {
    name: /body/i,
  });

  // The data initial is right
  expect(inptuTitle).toHaveValue(reviewCreated.title);
  expect(inputBody).toHaveValue(reviewCreated.body);

  const user = userEvent.setup();

  // Change title, this input is already focus
  // First remove all of the text
  await user.clear(inptuTitle);
  await user.type(inptuTitle, newReview.title);
  expect(screen.getByRole('textbox', {
    name: /title/i,
  })).toHaveValue(newReview.title);

  // Change body
  act(() => {
    inputBody.focus();
  });
  // First remove all of the text
  await user.clear(inputBody);
  await user.type(inputBody, newReview.body);
  expect(screen.getByRole('textbox', {
    name: /body/i,
  })).toHaveValue(newReview.body);

  // Right function handleSave
  // Save the changes
  await user.click(screen.getByRole('button', {
    name: /save/i,
  }));

  // Modal notification called with right props
  await waitFor(() => {
    expect(screen.getByTestId('notification-dialog')).toBeInTheDocument();
  });

  expect(ModalNotification).toHaveBeenLastCalledWith({
    open: true,
    title: 'Success',
    body: 'The operation was carried out successfully.',
    handleClose: expect.any(Function),
  }, {});

  // close modal
  await user.click(within(screen.getByTestId('notification-dialog')).getByRole('button', {
    name: /close/i,
  }));

  await waitFor(() => {
    expect(screen.queryByTestId('notification-dialog')).not.toBeInTheDocument();
  });

  // Call to the service with right arguments
  expect(editReview).toHaveBeenCalledWith({
    title: newReview.title,
    body: newReview.body,
    movieId: `${mockMovieTMDB.id}`,
    reviewId: reviewCreated.review.id,
  });

  // Redirection to right route
  expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
  expect(mockedUsedNavigate)
    .toHaveBeenCalledWith(linkRoutes.reviewForm.reviews(mockCurrentUser.id));
}, 100000);

it('right classes and inline styles', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/review-form/${mockMovieTMDB.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/review-form/:movieId" element={<ReviewForm />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.getByTestId('page-review-form')).toHaveClass('page');

  const releaseDate = mockMovieTMDB.release_date && typeof mockMovieTMDB.release_date === 'string' ? ` (${mockMovieTMDB.release_date.slice(0, 4)})` : '';
  const userReviewsLinkMatcher = `${mockMovieTMDB.title}${releaseDate}`;
  const userReviewsLink = screen.getByRole('link', {
    name: userReviewsLinkMatcher,
  });
  expect(userReviewsLink).toHaveClass('page-review-form-movie-title');
  expect(userReviewsLink).toHaveStyle(`color: ${darkTheme.palette.primary.main}`);

  expect(screen.getByTestId('page-review-form-container-img')).toHaveClass('page-review-form-container-img');

  const h1Matcher = 'your review';
  expect(screen.getByRole('heading', {
    name: new RegExp(h1Matcher, 'i'),
    level: 1,
  })).toHaveStyle(`color: ${darkTheme.palette.secondary.light}`);

  expect(screen.getByTestId('page-review-form-form')).toHaveClass('page-form');

  expect(screen.getByRole('button', { name: /save/i })).toHaveStyle(`background-color: ${darkTheme.palette.primary.main}`);

  expect(screen.getByTestId('page-review-form-alert')).toHaveClass('page-form-alert');
});
