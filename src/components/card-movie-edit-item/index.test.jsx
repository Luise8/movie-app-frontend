import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import linkRoutes from 'src/utils/link-routes';
import appResourcesPath from 'src/utils/app-resources-path';
import CardMovieEditItem from 'src/components/card-movie-edit-item';
import testDbHelpers from 'src/utils/test-db-helpers';
import { ThemeProvider } from '@emotion/react';
import darkTheme from 'src/utils/darkTheme';
import userEvent from '@testing-library/user-event';

const handleDelete = jest.fn();

beforeEach(() => {
  handleDelete.mockClear();
});
it('right render with image provided', () => {
  const movie = testDbHelpers.oneListUserLight.results[0];
  render(
    <MemoryRouter>
      <CardMovieEditItem data={{ ...movie, index: 0, handleDelete }} />
    </MemoryRouter>,
  );

  // Right image
  const img = screen.getByTestId('card-movie-edit-item-card-media');

  expect(img).toBeInTheDocument();
  expect(img).toHaveAttribute('src', movie.photo);

  expect(screen.getByRole('heading', {
    level: 2,
    name: `${movie.name}`,
  })).toBeInTheDocument();

  expect(screen.getByText(movie.release_date.slice(0, 4))).toBeInTheDocument();

  const ratingDefaultValue = movie.rateAverage ? 1 : 0;
  const rating = screen.getByRole('img', {
    name: `${ratingDefaultValue} Stars`,
  });
  expect(rating).toBeInTheDocument();

  const ratingAverageText = movie.rateAverage > 0 ? movie.rateAverage : '';
  expect(screen.getByTestId('ratingAverage')).toHaveTextContent(ratingAverageText);

  expect(screen.getByRole('button', {
    name: 'delete',
  })).toBeInTheDocument();

  expect(screen.getByTestId('card-movie-edit-item-container-image')).toHaveAttribute('href', linkRoutes.cardMovieEditItem(movie.idTMDB));

  expect(screen.getByTestId('link-title')).toHaveAttribute('href', linkRoutes.cardMovieEditItem(movie.idTMDB));
});

it('right render without image provided', () => {
  const movie = testDbHelpers.oneListUserLight.results[0];

  render(
    <MemoryRouter>
      <CardMovieEditItem data={{
        ...movie, photo: '', index: 0, handleDelete,
      }}
      />
    </MemoryRouter>,
  );

  // Right substitute image
  const img = screen.getByTestId('card-movie-edit-item-card-media');

  expect(img).toBeInTheDocument();
  expect(img).toHaveAttribute('src', appResourcesPath.cardMovieSmall.noImageAvailable);
});

it('right call of delete handler when press delete button', async () => {
  const movie = testDbHelpers.oneListUserLight.results[0];

  render(
    <MemoryRouter>
      <CardMovieEditItem data={{
        ...movie, index: 0, handleDelete,
      }}
      />
    </MemoryRouter>,
  );

  const user = userEvent.setup();
  await user.click(
    screen.getByRole('button', {
      name: /delete/i,
    }),
  );
  expect(handleDelete).toBeCalledTimes(1);
});

it('right classes and inline styles', () => {
  const movie = testDbHelpers.oneListUserLight.results[0];
  render(
    <MemoryRouter>
      <ThemeProvider theme={darkTheme}>
        <CardMovieEditItem data={{
          ...movie, index: 0, handleDelete,
        }}
        />
      </ThemeProvider>
    </MemoryRouter>,
  );

  expect(screen.getByTestId('card-movie-edit-item')).toHaveClass('card-movie-edit-item');

  expect(screen.getByTestId('card-movie-edit-item-container-image')).toHaveClass('card-movie-edit-item-container-image');

  // img
  expect(screen.getByTestId('card-movie-edit-item-card-media')).toHaveClass('card-movie-edit-item-card-media');

  expect(screen.getByTestId('card-movie-edit-item-container-right')).toHaveClass('card-movie-edit-item-container-right');

  const h2 = screen.getByRole('heading', {
    level: 2,
    name: `${movie.name}`,
  });
  expect(h2).toHaveClass('card-movie-edit-item-title-1');

  expect(screen.getByTestId('card-movie-edit-item-container-right-body')).toHaveClass('card-movie-edit-item-container-right-body');

  expect(h2).toHaveStyle(`color: ${darkTheme.palette.primary.light}`);
});
