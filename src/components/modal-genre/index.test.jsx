import React, { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ModalGenre from 'src/components/modal-genre';
import { act } from 'react-dom/test-utils';
import genresTMDB from 'src/utils/movie-genres-TMDB';

it('right render and functionalities with data provided and when open is true', async () => {
  const open = true;
  const handleConfirm = jest.fn();
  const handleClose = jest.fn();

  function TestComponent() {
    const [genres, setGenres] = useState([]);
    function handleChange(event, value) {
      setGenres(value);
    }
    return (
      <ModalGenre
        genres={genres}
        handleClose={handleClose}
        // eslint-disable-next-line react/jsx-no-bind
        handleChange={handleChange}
        handleConfirm={handleConfirm}
        open={open}
      />
    );
  }

  render(
    <TestComponent />,
  );

  expect(screen.getByTestId('genre-search-dialog')).toBeInTheDocument();
  const autocomplete = screen.getByTestId('autocomplete-genre-search');
  expect(autocomplete).toBeInTheDocument();

  // Events
  expect(screen.queryByText(genresTMDB[0].name)).not.toBeInTheDocument();

  const user = userEvent.setup();
  const input = within(autocomplete).getByRole('combobox');

  act(() => input.focus());

  await user.type(input, 'action');
  await user.keyboard('[ArrowDown]');
  await user.keyboard('[Enter]');

  expect(screen.queryByText(genresTMDB[0].name)).toBeInTheDocument();

  await user.click(
    screen.getByRole('button', {
      name: /cancel/i,
    }),
  );
  expect(handleClose).toBeCalledTimes(1);

  await user.click(
    screen.getByRole('button', {
      name: /find/i,
    }),
  );

  expect(handleConfirm).toBeCalledTimes(1);
});

it('right render when open is false', () => {
  const genres = [];
  const handleConfirm = jest.fn();
  const handleClose = jest.fn();
  const handleChange = jest.fn();
  const open = false;

  render(
    <ModalGenre
      genres={genres}
      handleClose={handleClose}
      handleChange={handleChange}
      handleConfirm={handleConfirm}
      open={open}
    />,
  );

  expect(screen.queryByTestId('genre-search-dialog')).not.toBeInTheDocument();
});
