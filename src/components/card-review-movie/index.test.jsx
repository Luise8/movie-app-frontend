import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import linkRoutes from 'src/utils/link-routes';
import testDbHelpers from 'src/utils/test-db-helpers';
import { ThemeProvider } from '@emotion/react';
import darkTheme from 'src/utils/darkTheme';
import testHelperFunctions from 'src/utils/test-helper-functions';
import CardReviewMovie from 'src/components/card-review-movie';

it('right render', () => {
  const review = testDbHelpers.reviewsMovie.results[0];
  render(
    <MemoryRouter>
      <CardReviewMovie data={review} />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', {
    level: 2,
    name: `${review.title} ${review.userId.username} ${new Date(review.date).toUTCString()}`,
  })).toBeInTheDocument();

  expect(screen.getByText(new RegExp(review.userId.username, 'i'))).toBeInTheDocument();

  expect(screen.getByText(new RegExp(new Date(review.date).toUTCString(), 'i'))).toBeInTheDocument();

  expect(screen.getByText(new RegExp(review.body, 'i'))).toBeInTheDocument();

  expect(screen.getByTestId('link-user')).toHaveAttribute('href', linkRoutes.cardReviewMovie(review.userId.id));
});

it('right classes and inline styles', () => {
  const review = testDbHelpers.reviewsMovie.results[0];
  render(
    <MemoryRouter>
      <ThemeProvider theme={darkTheme}>
        <CardReviewMovie data={review} />
      </ThemeProvider>
    </MemoryRouter>,
  );
  expect(screen.getByTestId('card-review-movie')).toHaveClass('card-review-movie');

  expect(screen.getByRole('heading', {
    level: 2,
    name: `${review.title} ${review.userId.username} ${new Date(review.date).toUTCString()}`,
  })).toHaveClass('card-review-movie-header');

  expect(screen.getByTestId('link-user')).toHaveStyle(`color: ${darkTheme.palette.primary.light}`);

  expect(screen.getByTestId('card-review-movie-card-content')).toHaveClass('card-review-movie-card-content');
});
