import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import linkRoutes from 'src/utils/link-routes';
import appResourcesPath from 'src/utils/app-resources-path';
import CardReviewUser from 'src/components/card-review-user';
import testDbHelpers from 'src/utils/test-db-helpers';
import { ThemeProvider } from '@emotion/react';
import darkTheme from 'src/utils/darkTheme';
import testHelperFunctions from 'src/utils/test-helper-functions';

it('right render with image provided', () => {
  const review = testDbHelpers.reviewsUser.results[0];
  render(
    <MemoryRouter>
      <CardReviewUser data={review} />
    </MemoryRouter>,
  );

  // Right image
  const img = screen.getByRole('img', {
    name: review.movieId.name,
  });

  expect(img).toBeInTheDocument();
  expect(img).toHaveAttribute('src', review.movieId.photo);

  const ratingIconName = review.movieId.rateAverage > 0 ? '1 Star' : '0 Stars';
  const rating = screen.getByRole('img', {
    name: ratingIconName,
  });

  expect(rating).toBeInTheDocument();

  const ratingAverageText = review.movieId.rateAverage > 0 ? review.movieId.rateAverage : '';
  expect(screen.getByTestId('ratingAverage')).toHaveTextContent(ratingAverageText);

  expect(screen.getByRole('heading', {
    level: 2,
    name: `${review.movieId.name} (${review.movieId.release_date.slice(0, 4)})`,
  })).toBeInTheDocument();

  expect(screen.getByRole('heading', {
    level: 3,
    name: review.title,
  })).toBeInTheDocument();

  expect(screen.getByText(new RegExp(new Date(review.date).toUTCString(), 'i'))).toBeInTheDocument();

  expect(screen.getByText(new RegExp(review.body, 'i'))).toBeInTheDocument();

  expect(screen.getByTestId('card-review-user-container-image')).toHaveAttribute('href', linkRoutes.cardReviewUser(review.movieId.idTMDB));

  expect(screen.getByTestId('link-title')).toHaveAttribute('href', linkRoutes.cardReviewUser(review.movieId.idTMDB));
});

it('right render without image provided and rateAverage 0', () => {
  const review = { ...testDbHelpers.reviewsUser.results[0], movieId: { ...testDbHelpers.reviewsUser.results[0].movieId, photo: '', rateAverage: 0 } };

  render(
    <MemoryRouter>
      <CardReviewUser data={review} />
    </MemoryRouter>,
  );

  // Right substitute image
  const img = screen.getByRole('img', {
    name: review.movieId.name,
  });

  expect(img).toBeInTheDocument();
  expect(img).toHaveAttribute('src', appResourcesPath.cardMovieSmall.noImageAvailable);

  const ratingIconName = review.movieId.rateAverage > 0 ? '1 Star' : '0 Stars';
  const rating = screen.getByRole('img', {
    name: ratingIconName,
  });

  expect(rating).toBeInTheDocument();

  const ratingAverageText = review.movieId.rateAverage > 0 ? review.movieId.rateAverage : '';
  expect(screen.getByTestId('ratingAverage')).toHaveTextContent(ratingAverageText);

  expect(screen.getByRole('heading', {
    level: 2,
    name: `${review.movieId.name} (${review.movieId.release_date.slice(0, 4)})`,
  })).toBeInTheDocument();

  expect(screen.getByRole('heading', {
    level: 3,
    name: review.title,
  })).toBeInTheDocument();

  expect(screen.getByText(new RegExp(new Date(review.date).toUTCString(), 'i'))).toBeInTheDocument();

  expect(screen.getByText(new RegExp(review.body, 'i'))).toBeInTheDocument();

  expect(screen.getByTestId('card-review-user-container-image')).toHaveAttribute('href', linkRoutes.cardReviewUser(review.movieId.idTMDB));

  expect(screen.getByTestId('link-title')).toHaveAttribute('href', linkRoutes.cardReviewUser(review.movieId.idTMDB));
});

it('right classes and inline styles', () => {
  const review = testDbHelpers.reviewsUser.results[0];
  render(
    <MemoryRouter>
      <ThemeProvider theme={darkTheme}>
        <CardReviewUser data={review} />
      </ThemeProvider>
    </MemoryRouter>,
  );

  expect(screen.getByTestId('card-review-user')).toHaveClass('card-review-user');

  expect(screen.getByTestId('card-review-user-container-image')).toHaveClass('card-review-user-container-image');

  const img = screen.getByRole('img', {
    name: review.movieId.name,
  });
  expect(img).toHaveClass('card-review-user-card-media');

  expect(screen.getByTestId('card-review-user-container-right')).toHaveClass('card-review-user-container-right');

  const h2 = screen.getByRole('heading', {
    level: 2,
    name: `${review.movieId.name} (${review.movieId.release_date.slice(0, 4)})`,
  });
  expect(h2).toHaveClass('card-review-user-title-1');

  expect(screen.getByTestId('card-review-user-container-right-body')).toHaveClass('card-review-user-container-right-body');

  expect(screen.getByTestId('card-review-user-container-title-2-date')).toHaveClass('card-review-user-container-title-2-date');
  const expectedColor = testHelperFunctions
    .colorConversion.hexStringToRgb(darkTheme.palette.primary.main);
  const StyleInlineH2 = window.getComputedStyle(h2);
  expect(StyleInlineH2.color).toEqual(expectedColor);
  expect(h2).toHaveStyle(`color: ${expectedColor}`);
});
