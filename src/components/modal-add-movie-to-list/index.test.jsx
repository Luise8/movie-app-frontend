import React from 'react';
import {
  render, screen, waitFor, within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import testDbHelpers from 'src/utils/test-db-helpers';
import { getAllListUserLight } from 'src/services/get-data';
import { editList } from 'src/services/list-write';
import editWatchist from 'src/services/watchlist-write';
import { Navigate } from 'react-router-dom';
import ModalAddMovieToList from 'src/components/modal-add-movie-to-list';

const mockData = testDbHelpers.allListsUserLight;

// mock get data service
jest.mock('src/services/get-data', () => ({
  getAllListUserLight: jest.fn(async () => Promise.resolve(mockData)),
}));

// mock write data service
jest.mock('src/services/list-write', () => ({
  editList: jest.fn(() => Promise.resolve('some feedback')),
}));

jest.mock('src/services/watchlist-write', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve('some feedback')),
}));

// mock useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
  Navigate: jest.fn(),
}));

// Clear mocks
beforeEach(async () => {
  getAllListUserLight.mockClear();
  editList.mockClear();
  editWatchist.mockClear();
  Navigate.mockClear();
  mockedUsedNavigate.mockClear();
});

it('right render when open is true', async () => {
  const open = true;
  const handleClose = jest.fn();

  await act(async () => {
    render(
      <ModalAddMovieToList open={open} handleClose={handleClose} userId="12345" movieId="987" />,
    );
  });

  expect(screen.getByTestId('add-movie-to-list-dialog')).toBeInTheDocument();
  const autocomplete = screen.getByTestId('autocomplete-add-movie-to-list');
  expect(autocomplete).toBeInTheDocument();

  expect(screen.getByText(/Select one list to add the movie/i)).toBeInTheDocument();

  expect(screen.getByRole('button', {
    name: /add/i,
  })).toBeInTheDocument();

  expect(screen.getAllByRole('button', {
    name: /close/i,
  })).toHaveLength(2);
});

it('right render when open is false', async () => {
  const open = false;
  const handleClose = jest.fn();

  await act(async () => {
    render(
      <ModalAddMovieToList open={open} handleClose={handleClose} userId="12345" movieId="987" />,
    );
  });

  expect(screen.queryByTestId('add-movie-to-list-dialog')).not.toBeInTheDocument();
});

it('the initial value of the autocomplete must be an empty string', async () => {
  const open = true;
  const handleClose = jest.fn();

  await act(async () => {
    render(
      <ModalAddMovieToList open={open} handleClose={handleClose} userId="12345" movieId="987" />,
    );
  });

  const autocomplete = screen.getByTestId('autocomplete-add-movie-to-list');
  const input = within(autocomplete).getByRole('combobox');
  expect(input).toHaveValue('');
});

it('the options of the autocomplete must be the names of the lists of the user, including one with the name Watchlist', async () => {
  const open = true;
  const handleClose = jest.fn();

  await act(async () => {
    render(
      <ModalAddMovieToList open={open} handleClose={handleClose} userId="12345" movieId="987" />,
    );
  });

  const autocomplete = screen.getByTestId('autocomplete-add-movie-to-list');
  const input = within(autocomplete).getByRole('combobox');
  expect(input).toHaveValue('');

  const user = userEvent.setup();

  await user.click(input);

  await waitFor(
    () => {
      // Every list should have ever the watchlist
      expect(screen.getByText(/watchlist/i)).toBeInTheDocument();
    },
  );
  mockData.results.map((list) => expect(screen.getByText(list.name)).toBeInTheDocument());
});

it('right call of handleClose with the close buttons', async () => {
  const open = true;
  const handleClose = jest.fn();

  await act(async () => {
    render(
      <ModalAddMovieToList open={open} handleClose={handleClose} userId="12345" movieId="987" />,
    );
  });
  expect(handleClose).not.toBeCalled();

  const closeButtons = screen.getAllByRole('button', {
    name: /close/i,
  });
  const user = userEvent.setup();
  await user.click(closeButtons[0]);

  expect(handleClose).toBeCalledTimes(1);

  await user.click(closeButtons[1]);

  expect(handleClose).toBeCalledTimes(2);
});

it('right call of editList with the right arguments when the add button is pressed and a list is selected', async () => {
  const open = true;
  const handleClose = jest.fn();
  const userId = '12345';
  const movieId = '987';
  await act(async () => {
    render(
      <ModalAddMovieToList
        open={open}
        handleClose={handleClose}
        userId={userId}
        movieId={movieId}
      />,
    );
  });
  expect(editList).not.toHaveBeenCalled();

  const autocomplete = screen.getByTestId('autocomplete-add-movie-to-list');
  const input = within(autocomplete).getByRole('combobox');

  const user = userEvent.setup();

  await user.click(input);

  await waitFor(
    () => {
      // Every list should have ever the watchlist
      expect(screen.getByText(/watchlist/i)).toBeInTheDocument();
    },
  );

  // The first result is a list other than the watchlist, unless the watchlist is the only list.
  await user.click(screen.getByText(mockData.results[0].name));

  await user.click(screen.getByRole('button', {
    name: /add/i,
  }));

  await waitFor(
    () => {
      expect(editList).toHaveBeenCalled();
    },
  );
  const ListWithNewMovie = mockData.results[0].movies.slice();
  ListWithNewMovie.push(movieId);
  expect(editList).toHaveBeenCalledWith({
    listId: mockData.results[0].id,
    movies: ListWithNewMovie,
    userId,
  });
});

it('right call of editWatchList with the right arguments when the add button is pressed and the watchlist is selected', async () => {
  const open = true;
  const handleClose = jest.fn();
  const userId = '12345';
  const movieId = '987';
  await act(async () => {
    render(
      <ModalAddMovieToList
        open={open}
        handleClose={handleClose}
        userId={userId}
        movieId={movieId}
      />,
    );
  });
  expect(editWatchist).not.toHaveBeenCalled();

  const autocomplete = screen.getByTestId('autocomplete-add-movie-to-list');
  const input = within(autocomplete).getByRole('combobox');

  const user = userEvent.setup();

  await user.click(input);

  await waitFor(
    () => {
      // Every list should have ever the watchlist
      expect(screen.getByText(/watchlist/i)).toBeInTheDocument();
    },
  );

  // The first result is a list other than the watchlist, unless the watchlist is the only list.
  await user.click(screen.getByText(/watchlist/i));

  await user.click(screen.getByRole('button', {
    name: /add/i,
  }));

  await waitFor(
    () => {
      expect(editWatchist).toHaveBeenCalled();
    },
  );

  const ListWithNewMovie = mockData.results.find((item) => item.name === 'Watchlist').movies.slice();

  ListWithNewMovie.push(movieId);
  expect(editWatchist).toHaveBeenCalledWith({
    movies: ListWithNewMovie,
    userId,
  });
});

it('the title and button add should change after successfully adding a movie to a list', async () => {
  const open = true;
  const handleClose = jest.fn();
  const userId = '12345';
  const movieId = '987';
  await act(async () => {
    render(
      <ModalAddMovieToList
        open={open}
        handleClose={handleClose}
        userId={userId}
        movieId={movieId}
      />,
    );
  });

  expect(screen.queryByText(/Movie added to the list/i)).not.toBeInTheDocument();

  const autocomplete = screen.getByTestId('autocomplete-add-movie-to-list');
  const input = within(autocomplete).getByRole('combobox');

  const user = userEvent.setup();

  await user.click(input);

  await waitFor(
    () => {
      expect(screen.getByText(/watchlist/i)).toBeInTheDocument();
    },
  );

  await user.click(screen.getByText(mockData.results[0].name));

  await user.click(screen.getByRole('button', {
    name: /add/i,
  }));

  await waitFor(
    () => {
      expect(editList).toHaveBeenCalled();
    },
  );

  expect(screen.getByText(/Movie added to the list/i)).toBeInTheDocument();
  expect(screen.queryByText(/Select one list to add the movie/i)).not.toBeInTheDocument();

  expect(screen.queryByRole('button', {
    name: /add/i,
  })).not.toBeInTheDocument();
});

it('Redirect to the correct error page when there is any error fetching the data other than 404', async () => {
  const open = true;
  const handleClose = jest.fn();
  const userId = '12345';
  const movieId = '987';

  getAllListUserLight.mockImplementationOnce(() => Promise.reject(new Error('something wrong')));

  await act(async () => {
    render(
      <ModalAddMovieToList
        open={open}
        handleClose={handleClose}
        userId={userId}
        movieId={movieId}
      />,
    );
  });

  expect(Navigate).toHaveBeenCalled();
  expect(Navigate).toHaveBeenCalledWith({ to: '/error' }, {});
});
