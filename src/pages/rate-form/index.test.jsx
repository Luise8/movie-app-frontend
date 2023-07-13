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
import { getMovieTmdb, getSpecificRateUser } from 'src/services/get-data';
import testDbHelpers from 'src/utils/test-db-helpers';
import { images } from 'src/utils/tmdb-resources-url';
import RateForm from 'src/pages/rate-form';
import { createRate, editRate } from 'src/services/rate-write';

const mockMovieTMDB = testDbHelpers.movieTMDB;
const rateCreated = testDbHelpers.specificRateUser;
const newRate = {
  value: 3,
};
const newOption = '3 Stars';

// mock get data services
jest.mock('src/services/get-data', () => ({
  getSpecificRateUser: jest.fn(() => Promise.resolve({
    rate: null,
  })),
  getMovieTmdb: jest.fn(() => Promise.resolve(mockMovieTMDB)),
}));

const mockCurrentUser = {
  id: rateCreated.rate.userId,
  username: 'userNumber2',
};
// mock useUserAuth
jest.mock('src/context/auth', () => ({
  useUserAuth: jest.fn(() => ({
    user: mockCurrentUser,
  })),
}));

// mock write data service
jest.mock('src/services/rate-write', () => ({
  createRate: jest.fn(() => Promise.resolve('some feedback')),
  editRate: jest.fn(() => Promise.resolve('some feedback')),
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
  getSpecificRateUser.mockClear();
  getMovieTmdb.mockClear();
  createRate.mockClear();
  editRate.mockClear();
  ModalNotification.mockClear();
  mockedUsedNavigate.mockClear();
  useUserAuth.mockImplementation(() => ({
    user: mockCurrentUser,
  }));
});

it('render right of initial page data after loading state of user logged in that has not rated the movie yet', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/rate-form/${mockMovieTMDB.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/rate-form/:movieId" element={<RateForm />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-rate-form');
  expect(page).toBeInTheDocument();

  const releaseDate = mockMovieTMDB.release_date && typeof mockMovieTMDB.release_date === 'string' ? ` (${mockMovieTMDB.release_date.slice(0, 4)})` : '';
  const userRatesLinkMatcher = `${mockMovieTMDB.title}${releaseDate}`;
  const userRatesLink = screen.getByRole('link', {
    name: userRatesLinkMatcher,
  });
  expect(userRatesLink).toHaveAttribute('href', linkRoutes.rateForm.movie(mockMovieTMDB.id));

  const containerImage = screen.getByTestId('page-rate-form-container-img');
  expect(containerImage).toHaveAttribute('href', linkRoutes.rateForm.movie(mockMovieTMDB.id));

  const img = within(containerImage).getByRole('img', {
    name: mockMovieTMDB.title,
  });

  expect(img).toHaveAttribute('src', images.posterSize154(mockMovieTMDB.poster_path));

  const h1Matcher = 'your rate';
  expect(screen.getByRole('heading', {
    name: new RegExp(h1Matcher, 'i'),
    level: 1,
  })).toBeInTheDocument();

  expect(screen.getByText(/^value$/i)).toBeInTheDocument();

  const rating = screen.getByTestId(/rating-average-star-icon/i);

  // Right number of options. 11 for the empty case
  expect(within(rating).getAllByRole('radio')).toHaveLength(11);

  // By default the initial option is 1
  expect(within(rating).getByLabelText(/1 star/i)).toBeChecked();

  const valueHelperText = screen.getByTestId(/value-restrictions/i);
  expect(valueHelperText).toHaveTextContent('The value must be between 1 and 10 stars.');

  const saveButton = screen.getByRole('button', {
    name: /save/i,
  });
  expect(saveButton).toBeInTheDocument();
});

it('render right of initial page data after loading state of user logged in that already have rated the movie', async () => {
  getSpecificRateUser.mockImplementationOnce(() => Promise.resolve(rateCreated));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/rate-form/${mockMovieTMDB.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/rate-form/:movieId" element={<RateForm />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-rate-form');
  expect(page).toBeInTheDocument();

  // Only change the option checked fields
  const rating = screen.getByTestId(/rating-average-star-icon/i);

  // The option now is corresponding to the rate received
  const star = rateCreated.rate.value !== 1 ? 'stars' : 'star';
  const matcher = `${rateCreated.rate.value} ${star}`;
  expect(within(rating).getByLabelText(new RegExp(matcher, 'i'))).toBeChecked();
});

it('Render right initial loading state', async () => {
  useUserAuth.mockImplementation(() => ({
    user: {},
  }));
  render(
    <MemoryRouter>
      <ThemeProvider theme={darkTheme}>
        <RateForm />
      </ThemeProvider>
      ,
    </MemoryRouter>,
  );
  await waitFor(() => {
    expect(screen.getByLabelText(/Loading.../i)).toBeInTheDocument();
  });
});

it('right handle of creation of rate', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/rate-form/${mockMovieTMDB.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/rate-form/:movieId" element={<RateForm />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-rate-form');
  expect(page).toBeInTheDocument();

  // The modal is not in the document
  expect(screen.queryByTestId('notification-dialog')).not.toBeInTheDocument();

  const rating = screen.getByTestId(/rating-average-star-icon/i);

  // The data initial is right
  expect(within(rating).getAllByRole('radio')).toHaveLength(11);
  expect(within(rating).getByLabelText(/1 star/i)).toBeChecked();

  const user = userEvent.setup();

  // Change the radio selected,
  await user.click(screen.getByLabelText(newOption));

  // The option selected changed
  expect(within(rating).getByLabelText(newOption)).toBeChecked();

  expect(within(rating).getByLabelText(/1 star/i)).not.toBeChecked();

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
  expect(createRate).toHaveBeenCalledWith({
    value: newRate.value,
    id: `${mockMovieTMDB.id}`,
  });

  // Redirection to right route
  expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
  expect(mockedUsedNavigate)
    .toHaveBeenCalledWith(linkRoutes.rateForm.rates(mockCurrentUser.id));
});

it('call of right function to handle edition of rate', async () => {
  getSpecificRateUser.mockImplementationOnce(() => Promise.resolve(rateCreated));
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/rate-form/${mockMovieTMDB.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/rate-form/:movieId" element={<RateForm />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-rate-form');
  expect(page).toBeInTheDocument();

  // The modal is not in the document
  expect(screen.queryByTestId('notification-dialog')).not.toBeInTheDocument();

  const rating = screen.getByTestId(/rating-average-star-icon/i);

  // The data initial is right
  expect(within(rating).getAllByRole('radio')).toHaveLength(11);
  const star = rateCreated.rate.value !== 1 ? 'stars' : 'star';
  const matcher = `${rateCreated.rate.value} ${star}`;
  expect(within(rating).getByLabelText(new RegExp(matcher, 'i'))).toBeChecked();

  const user = userEvent.setup();

  // Change the radio selected,
  await user.click(screen.getByLabelText(newOption));

  // The option selected changed
  expect(within(rating).getByLabelText(newOption)).toBeChecked();

  expect(within(rating).getByLabelText(new RegExp(matcher, 'i'))).not.toBeChecked();

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
  expect(editRate).toHaveBeenCalledWith({
    value: newRate.value,
    rateId: rateCreated.rate.id,
    movieId: `${mockMovieTMDB.id}`,
  });

  // Redirection to right route
  expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
  expect(mockedUsedNavigate)
    .toHaveBeenCalledWith(linkRoutes.rateForm.rates(mockCurrentUser.id));
});

it('right classes and inline styles', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[`/rate-form/${mockMovieTMDB.id}`]}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/rate-form/:movieId" element={<RateForm />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.getByTestId('page-rate-form')).toHaveClass('page');

  const releaseDate = mockMovieTMDB.release_date && typeof mockMovieTMDB.release_date === 'string' ? ` (${mockMovieTMDB.release_date.slice(0, 4)})` : '';
  const userRatesLinkMatcher = `${mockMovieTMDB.title}${releaseDate}`;
  const userRatesLink = screen.getByRole('link', {
    name: userRatesLinkMatcher,
  });
  expect(userRatesLink).toHaveClass('page-rate-form-movie-title');
  expect(userRatesLink).toHaveStyle(`color: ${darkTheme.palette.primary.main}`);

  expect(screen.getByTestId('page-rate-form-container-img')).toHaveClass('page-rate-form-container-img');

  const h1Matcher = 'your rate';
  expect(screen.getByRole('heading', {
    name: new RegExp(h1Matcher, 'i'),
    level: 1,
  })).toHaveStyle(`color: ${darkTheme.palette.secondary.light}`);

  expect(screen.getByTestId('page-rate-form-form')).toHaveClass('page-form');

  expect(screen.getByTestId('rating-average-star-icon')).toHaveClass('page-rate-form-rating');

  expect(screen.getByRole('button', { name: /save/i })).toHaveStyle(`background-color: ${darkTheme.palette.primary.main}`);

  expect(screen.getByTestId('page-rate-form-alert')).toHaveClass('page-form-alert');
});
