import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CardMovieSmall from 'src/components/card-movie-small';
import { MemoryRouter } from 'react-router-dom';
import linkRoutes from 'src/utils/link-routes';
import appResourcesPath from 'src/utils/app-resources-path';
import testDbHelpers from 'src/utils/test-db-helpers';

it('right render without rating data', () => {
  const movieWithOutRating = testDbHelpers.moviesPopular.results[0];
  render(
    <MemoryRouter>
      <CardMovieSmall cardData={movieWithOutRating} />
    </MemoryRouter>,
  );

  // Has the image
  expect(screen.getByRole('img', {
    name: movieWithOutRating.title,
  })).toBeInTheDocument();

  const link = screen.getByRole('link');

  expect(link).toHaveAttribute('href', linkRoutes.cardMovieSmall(movieWithOutRating.id));

  expect(screen.getByText(new RegExp(movieWithOutRating.title, 'i'))).toBeInTheDocument();
});

it('right render with data with rating', () => {
  const movieWithRating = testDbHelpers.moviesRated.results[0];
  render(
    <MemoryRouter>
      <CardMovieSmall cardData={movieWithRating} />
    </MemoryRouter>,
  );

  // Has the image
  const img = screen.getByRole('img', {
    name: movieWithRating.name,
  });

  expect(img).toBeInTheDocument();
  const link = screen.getByTestId('card-movie-small-link');

  expect(link).toHaveAttribute('href', linkRoutes.cardMovieSmall(movieWithRating.idTMDB));

  expect(screen.getByText(new RegExp(movieWithRating.name, 'i'))).toBeInTheDocument();

  // start rating component
  const rating = screen.getByRole('img', {
    name: /1 star/i,
  });
  expect(rating).toBeInTheDocument();
  // end rating component

  expect(screen.getByText(new RegExp(movieWithRating.rateAverage, 'i'))).toBeInTheDocument();
});

it('right render without rating data and without photo/poster_path', () => {
  const movieWithOutRating = testDbHelpers.moviesPopular.results[0];
  render(
    <MemoryRouter>
      <CardMovieSmall cardData={{ ...movieWithOutRating, poster_path: '' }} />
    </MemoryRouter>,
  );

  // Right substitute image
  const img = screen.getByRole('img', {
    name: movieWithOutRating.title,
  });
  expect(img).toBeInTheDocument();
  expect(img).toHaveAttribute('src', appResourcesPath.cardMovieSmall.noImageAvailable);
});

it('right classes', () => {
  const movieWithOutRating = testDbHelpers.moviesPopular.results[0];
  render(
    <MemoryRouter>
      <CardMovieSmall cardData={movieWithOutRating} />
    </MemoryRouter>,
  );

  const img = screen.getByRole('img', {
    name: movieWithOutRating.title,
  });
  expect(img).toHaveClass('card-movie-small-card-media');
  expect(screen.getByTestId('card-movie-small-card-content')).toHaveClass('card-movie-small-card-content');
  expect(screen.getByTestId('typography-two-lines-elipsis')).toHaveClass('typography-two-lines-elipsis');
});
