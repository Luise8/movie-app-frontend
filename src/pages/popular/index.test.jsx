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
import Popular from 'src/pages/popular';
import { getPopularMovies } from 'src/services/get-data';
import ListGridMovies from 'src/components/list-movie-grid';

const mockData = testDbHelpers.moviesPopular;
// mock get data service
jest.mock('src/services/get-data', () => ({
  getPopularMovies: jest.fn(() => (Promise.resolve(mockData))),
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
jest.mock('src/components/list-movie-grid', () => ({
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
  getPopularMovies.mockClear();
  ListGridMovies.mockClear();
  useUserAuth.mockClear();
});

it('render right of initial page data after loading state', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/popular']}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/popular" element={<Popular />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });
  expect(getPopularMovies).toBeCalled();

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-popular');
  expect(page).toBeInTheDocument();

  const h1Matcher = 'Popular movies';
  expect(screen.getByRole('heading', {
    name: new RegExp(h1Matcher, 'i'),
    level: 1,
  })).toBeInTheDocument();

  expect(screen.getByText(`Total: ${mockData.total_results}`)).toBeInTheDocument();

  // Call of ListGridMovies with right data
  expect(ListGridMovies).toHaveBeenLastCalledWith({
    list: mockData.results,
  }, {});

  expect(screen.getByRole('button', {
    name: /more/i,
  })).toBeInTheDocument();
});

it('Render right initial loading state', async () => {
  render(
    <MemoryRouter>
      <ThemeProvider theme={darkTheme}>
        <Popular />
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
      <MemoryRouter initialEntries={['/popular']}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/popular" element={<Popular />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });
  expect(getPopularMovies).toBeCalled();

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  expect(screen.queryByTestId(/page-popular/i)).not.toBeInTheDocument();

  expect(screen.getByTestId(/^error-container$/i)).toBeInTheDocument();
});

it('right handle of pagintation', async () => {
  // Change mock get data service to give max only 1 item per
  // page to make more easy pagination tests. Real implementation gives max 20.

  // Fist page
  const pageOne = {
    ...mockData, page: 1, total_results: 2, page_zise: 1, next_page: 'next page url', results: [mockData.results[0]],
  };

  // Second Page
  const pageTwo = {
    ...mockData, page: 2, total_results: 2, page_zise: 1, prev_page: 'perv page url', next_page: '', results: [mockData.results[1]],
  };

  // new max data
  const newTotalResult = pageOne.results.slice().concat(pageTwo.results);

  getPopularMovies
    .mockImplementationOnce(() => Promise.resolve(pageOne))
    .mockImplementationOnce(() => Promise.resolve(pageTwo));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/popular']}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/popular" element={<Popular />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-popular');
  expect(page).toBeInTheDocument();

  // The button more is not disabled when there are more data
  expect(screen.getByRole('button', {
    name: /more/i,
  })).not.toHaveAttribute('disabled');

  expect(ListGridMovies).toHaveBeenLastCalledWith({
    list: pageOne.results,
  }, {});

  const user = userEvent.setup();
  const buttonMore = screen.getByRole('button', {
    name: /more/i,
  });

  await user.click(buttonMore);

  expect(ListGridMovies).toHaveBeenLastCalledWith({
    list: newTotalResult,
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
  getPopularMovies
    .mockImplementationOnce(() => Promise.resolve(notLastPage));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/popular']}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/popular" element={<Popular />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.getByTestId('page-popular')).toHaveClass('page');

  expect(screen.getByTestId('page-container-button-more')).toHaveClass('page-container-button-more');

  const h1Matcher = 'Popular movies';
  expect(screen.getByRole('heading', {
    name: new RegExp(h1Matcher, 'i'),
    level: 1,
  })).toHaveStyle(`color: ${darkTheme.palette.secondary.light}`);

  // atribute of Button color secondary and variant contained
  expect(screen.getByRole('button', {
    name: /more/i,
  })).toHaveClass('MuiButton-containedSecondary');
});
