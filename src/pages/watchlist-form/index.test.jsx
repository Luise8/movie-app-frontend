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
import linkRoutes from 'src/utils/link-routes';
import { useUserAuth } from 'src/context/auth';
import WatchlistForm from 'src/pages/watchlist-form';
import { getWatchlistUserLight } from 'src/services/get-data';
import editWatchist from 'src/services/watchlist-write';
import CardMovieEditItem from 'src/components/card-movie-edit-item';
import ModalNotification from 'src/components/modal-notification';

const mockData = testDbHelpers.watchlistUserLight;
// mock get data service
jest.mock('src/services/get-data', () => ({
  getWatchlistUserLight: jest.fn(() => (Promise.resolve(mockData))),
}));

// mock write data service
jest.mock('src/services/watchlist-write', () => ({
  __esModule: true,
  default: jest.fn(({ movies }) => ({
    userId: mockData.user_details.id,
    movies: movies.slice().map((e) => e.id),
    id: mockData.id,
  })),
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

// Mock PageLayout
jest.mock('src/components/page-layout', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <div data-testid="page-layout">{children}</div>),
}));

// Mock item
jest.mock('src/components/card-movie-edit-item');
CardMovieEditItem.mockImplementation(jest.requireActual('src/components/card-movie-edit-item').default);

// Mock modal
jest.mock('src/components/modal-notification');
ModalNotification.mockImplementation(jest.requireActual('src/components/modal-notification').default);

// Clear mocks
beforeEach(async () => {
  getWatchlistUserLight.mockClear();
  editWatchist.mockClear();
  CardMovieEditItem.mockClear();
  ModalNotification.mockClear();
  useUserAuth.mockImplementation(() => ({
    user: mockCurrentUser,
  }));
});

it('render right of initial page data after loading state of user loggedIn', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/watchlist-form']}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/watchlist-form" element={<WatchlistForm />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });
  expect(getWatchlistUserLight).toBeCalled();

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-watchlist-form');
  expect(page).toBeInTheDocument();

  const linkListMatcher = 'see list';
  const linkList = screen.getByRole('link', {
    name: new RegExp(linkListMatcher, 'i'),
  });
  expect(linkList).toBeInTheDocument();

  expect(linkList).toHaveAttribute('href', linkRoutes.watchlistForm(mockCurrentUser.id));

  const h1Matcher = 'edit watchlist';
  expect(screen.getByRole('heading', {
    name: new RegExp(h1Matcher, 'i'),
    level: 1,
  })).toBeInTheDocument();

  expect(screen.getByText(`Total: ${mockData.total}`)).toBeInTheDocument();

  const revertButton = screen.getByRole('button', {
    name: /revert/i,
  });
  expect(revertButton).toBeInTheDocument();

  const saveButton = screen.getByRole('button', {
    name: /save/i,
  });
  expect(saveButton).toBeInTheDocument();

  const items = screen.getAllByTestId('card-movie-edit-item');
  expect(items).toHaveLength(mockData.total);
  expect(CardMovieEditItem).toBeCalledTimes(mockData.total);
  // First item
  expect(CardMovieEditItem).toHaveBeenNthCalledWith(1, {
    data: {
      ...mockData.results[0],
      handleDelete: expect.any(Function),
      index: 0,
    },
  }, {});
  // Second item
  expect(CardMovieEditItem).toHaveBeenNthCalledWith(2, {
    data: {
      ...mockData.results[1],
      handleDelete: expect.any(Function),
      index: 1,
    },
  }, {});
  // Third item
  expect(CardMovieEditItem).toHaveBeenLastCalledWith({
    data: {
      ...mockData.results[mockData.total - 1],
      handleDelete: expect.any(Function),
      index: mockData.total - 1,
    },
  }, {});
});

it('Render right initial loading state', async () => {
  render(
    <MemoryRouter>
      <ThemeProvider theme={darkTheme}>
        <WatchlistForm />
      </ThemeProvider>
      ,
    </MemoryRouter>,
  );
  await waitFor(() => {
    expect(screen.getByLabelText(/Loading.../i)).toBeInTheDocument();
  });
});

it('Render the correct error page when there is any initial error other than 404 and 401', async () => {
  getWatchlistUserLight.mockImplementationOnce(() => Promise.reject(new Error('something wrong')));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/watchlist-form']}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/watchlist-form" element={<WatchlistForm />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });
  expect(getWatchlistUserLight).toBeCalled();

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  expect(screen.queryByTestId(/page-watchlist-form/i)).not.toBeInTheDocument();

  expect(screen.getByTestId(/^error-container$/i)).toBeInTheDocument();
});

it('right handle of events', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/watchlist-form']}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/watchlist-form" element={<WatchlistForm />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  const pageLayout = screen.getByTestId('page-layout');
  expect(pageLayout).toBeInTheDocument();

  const page = within(pageLayout).getByTestId('page-watchlist-form');
  expect(page).toBeInTheDocument();

  // The modal is not in the document
  expect(screen.queryByTestId('notification-dialog')).not.toBeInTheDocument();

  // Right amount initial items rendered
  const items = screen.getAllByTestId('card-movie-edit-item');
  expect(items).toHaveLength(mockData.total);

  // Right total
  expect(screen.getByText(`Total: ${mockData.total}`)).toBeInTheDocument();

  const user = userEvent.setup();

  // delete first item
  await user.click(within(items[0]).getByRole('button', {
    name: /delete/i,
  }));

  expect(screen.getAllByTestId('card-movie-edit-item')).toHaveLength(mockData.total - 1);

  // The notal hasn't changed until the change has been saved
  expect(screen.getByText(`Total: ${mockData.total}`)).toBeInTheDocument();

  // Right function handleCancel
  // Revert delete of item
  await user.click(screen.getByRole('button', {
    name: /revert/i,
  }));

  // The items were restored to the initial state
  const itemsSecondTime = screen.getAllByTestId('card-movie-edit-item');
  expect(itemsSecondTime).toHaveLength(mockData.total);

  // The list item was restored
  expect(within(itemsSecondTime[0]).getByText(mockData.results[0].name)).toBeInTheDocument();

  // delete item again
  await user.click(within(itemsSecondTime[0]).getByRole('button', {
    name: /delete/i,
  }));

  expect(screen.getAllByTestId('card-movie-edit-item')).toHaveLength(mockData.total - 1);

  // Right function handleSave
  // Save the list without the item deleted
  await user.click(screen.getByRole('button', {
    name: /save/i,
  }));

  // Modal notification called with right props
  await waitFor(() => {
    expect(ModalNotification).toHaveBeenLastCalledWith({
      open: true,
      title: 'Successfully updated',
      body: 'List updated successfully',
      handleClose: expect.any(Function),
    }, {});
  });

  expect(screen.getByTestId('notification-dialog')).toBeInTheDocument();

  // close modal
  await user.click(within(screen.getByTestId('notification-dialog')).getByRole('button', {
    name: /close/i,
  }));

  await waitFor(() => {
    expect(screen.queryByTestId('notification-dialog')).not.toBeInTheDocument();
  });

  // The total now was changed
  expect(screen.getByText(`Total: ${mockData.total - 1}`)).toBeInTheDocument();

  // Trying to revert doesn't work when the change was saved
  await user.click(screen.getByRole('button', {
    name: /revert/i,
  }));

  // The item remains deleted
  expect(screen.getAllByTestId('card-movie-edit-item')).toHaveLength(mockData.total - 1);

  // the total did not change with the revert button
  expect(screen.getByText(`Total: ${mockData.total - 1}`)).toBeInTheDocument();
}, 100000);

it('Render the correct error page when there is any error other than 404 and 401 editing the list', async () => {
  editWatchist.mockImplementationOnce(() => Promise.reject(new Error('something wrong')));

  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/watchlist-form']}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/watchlist-form" element={<WatchlistForm />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });
  expect(getWatchlistUserLight).toBeCalled();

  expect(screen.queryByLabelText(/Loading.../i)).not.toBeInTheDocument();

  expect(screen.getByTestId(/^page-watchlist-form$/i)).toBeInTheDocument();

  // Right amount initial items rendered
  const items = screen.getAllByTestId('card-movie-edit-item');
  expect(items).toHaveLength(mockData.total);

  const user = userEvent.setup();

  // delete first item
  await user.click(within(items[0]).getByRole('button', {
    name: /delete/i,
  }));

  // save changes
  await user.click(screen.getByRole('button', {
    name: /save/i,
  }));

  // Right redirect to error page
  expect(await screen.findByTestId(/^error-container$/i)).toBeInTheDocument();

  expect(screen.queryByTestId(/page-watchlist-form/i)).not.toBeInTheDocument();
});

it('right classes and inline styles', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/watchlist-form']}>
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/watchlist-form" element={<WatchlistForm />} />
          </Routes>
        </ThemeProvider>
        ,
      </MemoryRouter>,
    );
  });

  expect(screen.getByTestId('page-watchlist-form')).toHaveClass('page');

  expect(screen.getByTestId('page-watchlist-form-container-button-see-list')).toHaveClass('page-watchlist-form-container-button-see-list');

  const linkListMatcher = 'see list';
  const linkList = screen.getByRole('link', {
    name: new RegExp(linkListMatcher, 'i'),
  });
  expect(linkList).toHaveStyle(`color: ${darkTheme.palette.primary.light}`);

  const h1Matcher = 'edit watchlist';
  expect(screen.getByRole('heading', {
    name: new RegExp(h1Matcher, 'i'),
    level: 1,
  })).toHaveStyle(`color: ${darkTheme.palette.secondary.light}`);

  expect(screen.getByTestId('page-watchlist-form-container-edit-buttons')).toHaveClass('page-watchlist-form-container-edit-buttons');

  expect(screen.getByRole('button', { name: /save/i })).toHaveStyle(`background-color: ${darkTheme.palette.primary.main}`);

  expect(screen.getByTestId('page-watchlist-form-alert')).toHaveClass('page-watchlist-form-alert');
});
