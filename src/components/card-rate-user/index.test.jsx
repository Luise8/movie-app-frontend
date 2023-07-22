import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import linkRoutes from 'src/utils/link-routes';
import userEvent from '@testing-library/user-event';
import appResourcesPath from 'src/utils/app-resources-path';
import testDbHelpers from 'src/utils/test-db-helpers';
import { ThemeProvider } from '@emotion/react';
import darkTheme from 'src/utils/darkTheme';
import testHelperFunctions from 'src/utils/test-helper-functions';
import CardRateUser from 'src/components/card-rate-user';

it('right render with image and handleDelete provided', () => {
  const rate = testDbHelpers.ratesUser.results[0];
  const handleDelete = jest.fn();
  render(
    <MemoryRouter>
      <CardRateUser data={{ ...rate, handleDelete }} />
    </MemoryRouter>,
  );

  // Right image
  const img = screen.getByRole('img', {
    name: rate.movieId.name,
  });

  expect(img).toBeInTheDocument();
  expect(img).toHaveAttribute('src', rate.movieId.photo);

  expect(screen.getByRole('heading', {
    level: 2,
    name: `${rate.movieId.name} (${rate.movieId.release_date.slice(0, 4)})`,
  })).toBeInTheDocument();

  expect(screen.getByRole('heading', {
    level: 3,
    name: /your rating/i,
  })).toBeInTheDocument();

  expect(screen.getByRole('heading', {
    level: 3,
    name: /The movie average/i,
  })).toBeInTheDocument();

  const ratingUserNumber = screen.getByTestId('user-rating-number');
  expect(ratingUserNumber).toBeInTheDocument();
  expect(ratingUserNumber).toHaveAccessibleName(`${rate.value}`);

  const ratingUserStarIcon = screen.getByTestId('user-rating-star-icon');
  expect(ratingUserStarIcon).toBeInTheDocument();
  expect(ratingUserStarIcon).toHaveAccessibleName(`${rate.value} Stars`);

  const ratingAverageNumber = screen.getByTestId('rating-average-number');
  expect(ratingAverageNumber).toBeInTheDocument();
  expect(ratingAverageNumber).toHaveAccessibleName(rate.movieId.rateAverage.toString());

  const ratingAverageStarIcon = screen.getByTestId('rating-average-star-icon');
  expect(ratingAverageStarIcon).toBeInTheDocument();
  expect(ratingAverageStarIcon).toHaveAccessibleName(`${rate.movieId.rateAverage} Stars`);

  expect(screen.getByText(new RegExp(new Date(rate.date).toUTCString(), 'i'))).toBeInTheDocument();

  expect(screen.getByText(new RegExp(rate.movieId.description, 'i'))).toBeInTheDocument();

  expect(screen.getByTestId('card-rate-user-container-image')).toHaveAttribute('href', linkRoutes.cardRateUser.movie(rate.movieId.idTMDB));

  expect(screen.getByTestId('link-title')).toHaveAttribute('href', linkRoutes.cardRateUser.movie(rate.movieId.idTMDB));

  expect(screen.getByRole('button', {
    name: /delete rate/i,
  })).toBeInTheDocument();

  expect(screen.getByRole('link', {
    name: /update rate/i,
  })).toHaveAttribute('href', linkRoutes.cardRateUser.editRate(rate.movieId.idTMDB));
});

it('right render without image or handleDelete provided', () => {
  const rate = testDbHelpers.ratesUser.results[0];

  render(
    <MemoryRouter>
      <CardRateUser data={{
        ...rate,
        movieId: {
          ...rate.movieId, photo: '',
        },
      }}
      />
    </MemoryRouter>,
  );

  // Right substitute image
  const img = screen.getByRole('img', {
    name: rate.movieId.name,
  });

  expect(img).toBeInTheDocument();
  expect(img).toHaveAttribute('src', appResourcesPath.cardMovieSmall.noImageAvailable);

  expect(screen.getByRole('heading', {
    level: 2,
    name: `${rate.movieId.name} (${rate.movieId.release_date.slice(0, 4)})`,
  })).toBeInTheDocument();

  expect(screen.getByRole('heading', {
    level: 3,
    name: /your rating/i,
  })).toBeInTheDocument();

  expect(screen.getByRole('heading', {
    level: 3,
    name: /The movie average/i,
  })).toBeInTheDocument();

  const ratingUserNumber = screen.getByTestId('user-rating-number');
  expect(ratingUserNumber).toBeInTheDocument();
  expect(ratingUserNumber).toHaveAccessibleName(`${rate.value}`);

  const ratingUserStarIcon = screen.getByTestId('user-rating-star-icon');
  expect(ratingUserStarIcon).toBeInTheDocument();
  expect(ratingUserStarIcon).toHaveAccessibleName(`${rate.value} Stars`);

  const ratingAverageNumber = screen.getByTestId('rating-average-number');
  expect(ratingAverageNumber).toBeInTheDocument();
  expect(ratingAverageNumber).toHaveAccessibleName(rate.movieId.rateAverage.toString());

  const ratingAverageStarIcon = screen.getByTestId('rating-average-star-icon');
  expect(ratingAverageStarIcon).toBeInTheDocument();
  expect(ratingAverageStarIcon).toHaveAccessibleName(`${rate.movieId.rateAverage} Stars`);

  expect(screen.getByText(new RegExp(new Date(rate.date).toUTCString(), 'i'))).toBeInTheDocument();

  expect(screen.getByText(new RegExp(rate.movieId.description, 'i'))).toBeInTheDocument();

  expect(screen.getByTestId('card-rate-user-container-image')).toHaveAttribute('href', linkRoutes.cardRateUser.movie(rate.movieId.idTMDB));

  expect(screen.getByTestId('link-title')).toHaveAttribute('href', linkRoutes.cardRateUser.movie(rate.movieId.idTMDB));

  expect(screen.queryByRole('button', {
    name: /delete rate/i,
  })).not.toBeInTheDocument();

  expect(screen.queryByRole('link', {
    name: /update rate/i,
  })).not.toBeInTheDocument();
});

it('right call of handleDelete when delete rate button is pressed', async () => {
  const rate = testDbHelpers.ratesUser.results[0];
  const handleDelete = jest.fn();
  render(
    <MemoryRouter>
      <CardRateUser data={{ ...rate, handleDelete }} />
    </MemoryRouter>,
  );

  const user = userEvent.setup();

  await user.click(screen.getByRole('button', {
    name: /delete rate/i,
  }));

  expect(handleDelete).toHaveBeenCalledTimes(1);
});

it('right classes and inline styles', () => {
  const rate = testDbHelpers.ratesUser.results[0];
  const handleDelete = jest.fn();
  render(
    <MemoryRouter>
      <ThemeProvider theme={darkTheme}>
        <CardRateUser data={{ ...rate, handleDelete }} />
      </ThemeProvider>
    </MemoryRouter>,
  );

  expect(screen.getByTestId('card-rate-user')).toHaveClass('card-rate-user');

  expect(screen.getByTestId('card-rate-user-container-image')).toHaveClass('card-rate-user-container-image');

  const img = screen.getByRole('img', {
    name: rate.movieId.name,
  });
  expect(img).toHaveClass('card-rate-user-card-media');

  const h2 = screen.getByRole('heading', {
    level: 2,
    name: `${rate.movieId.name} (${rate.movieId.release_date.slice(0, 4)})`,
  });
  expect(h2).toHaveClass('card-rate-user-title-1');

  expect(screen.getByTestId('card-rate-user-all-rates-container')).toHaveClass('card-rate-user-all-rates-container');

  const ratingRowContainers = screen.getAllByTestId('card-rate-user-rating-row-container');
  ratingRowContainers.forEach((item) => expect(item).toHaveClass('card-rate-user-rating-row-container'));

  expect(screen.getByRole('heading', {
    level: 3,
    name: /your rating/i,
  })).toHaveStyle(`color: ${darkTheme.palette.secondary.light}`);

  expect(screen.getByRole('heading', {
    level: 3,
    name: /The movie average/i,
  })).toHaveStyle(`color: ${darkTheme.palette.secondary.light}`);

  const primaryColor = testHelperFunctions
    .colorConversion.hexStringToRgb(darkTheme.palette.primary.main);
  expect(h2).toHaveStyle(`color: ${primaryColor}`);

  expect(screen.getByTestId('card-rate-user-container-edit-buttons')).toHaveClass('card-rate-user-container-edit-buttons');
});
