import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import linkRoutes from 'src/utils/link-routes';
import appResourcesPath from 'src/utils/app-resources-path';
import CardMovieMedium from 'src/components/card-movie-medium';
import testDbHelpers from 'src/utils/test-db-helpers';
import { ThemeProvider } from '@emotion/react';
import darkTheme from 'src/utils/darkTheme';
import testHelperFunctions from 'src/utils/test-helper-functions';

it('right render with image provided', () => {
  const movie = testDbHelpers.oneListuser.results[0];
  render(
    <MemoryRouter>
      <CardMovieMedium data={movie} />
    </MemoryRouter>,
  );

  // Right image
  const img = screen.getByRole('img', {
    name: movie.name,
  });

  expect(img).toBeInTheDocument();
  expect(img).toHaveAttribute('src', movie.photo);

  const ratingDefaultValue = movie.rateAverage ? 1 : 0;
  const rating = screen.getByRole('img', {
    name: `${ratingDefaultValue} Stars`,
  });
  expect(rating).toBeInTheDocument();

  const ratingAverageText = movie.rateAverage > 0 ? movie.rateAverage : '';
  expect(screen.getByTestId('ratingAverage')).toHaveTextContent(ratingAverageText);

  expect(screen.getByRole('heading', {
    level: 2,
    name: `${movie.name} (${movie.release_date.slice(0, 4)})`,
  })).toBeInTheDocument();

  expect(screen.getByText(new RegExp(movie.description, 'i'))).toBeInTheDocument();

  expect(screen.getByTestId('card-movie-medium-container-image')).toHaveAttribute('href', linkRoutes.cardMovieMedium(movie.idTMDB));

  expect(screen.getByTestId('link-title')).toHaveAttribute('href', linkRoutes.cardMovieMedium(movie.idTMDB));
});

it('right render without image provided', () => {
  const movie = testDbHelpers.oneListuser.results[0];

  render(
    <MemoryRouter>
      <CardMovieMedium data={{
        ...movie, photo: '',
      }}
      />
    </MemoryRouter>,
  );

  // Right substitute image
  const img = screen.getByRole('img', {
    name: movie.name,
  });

  expect(img).toBeInTheDocument();
  expect(img).toHaveAttribute('src', appResourcesPath.cardMovieSmall.noImageAvailable);
});

it('right classes and inline styles', () => {
  const movie = testDbHelpers.oneListuser.results[0];
  render(
    <MemoryRouter>
      <ThemeProvider theme={darkTheme}>
        <CardMovieMedium data={movie} />
      </ThemeProvider>
    </MemoryRouter>,
  );

  expect(screen.getByTestId('card-movie-medium')).toHaveClass('card-movie-medium');

  expect(screen.getByTestId('card-movie-medium-container-image')).toHaveClass('card-movie-medium-container-image');

  const img = screen.getByRole('img', {
    name: movie.name,
  });
  expect(img).toHaveClass('card-movie-medium-card-media');

  expect(screen.getByTestId('card-movie-medium-container-right')).toHaveClass('card-movie-medium-container-right');

  const h2 = screen.getByRole('heading', {
    level: 2,
    name: `${movie.name} (${movie.release_date.slice(0, 4)})`,
  });
  expect(h2).toHaveClass('card-movie-medium-title-1');

  expect(screen.getByTestId('card-movie-medium-container-right-body')).toHaveClass('card-movie-medium-container-right-body');

  const expectedColor = testHelperFunctions
    .colorConversion.hexStringToRgb(darkTheme.palette.primary.main);
  expect(h2).toHaveStyle(`color: ${expectedColor || '#111'}`);
});
