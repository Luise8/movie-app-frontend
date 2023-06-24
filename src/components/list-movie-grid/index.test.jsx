import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListGridMovies from 'src/components/list-movie-grid';
import CardMovieSmall from 'src/components/card-movie-small';
import testDbHelpers from 'src/utils/test-db-helpers';

jest.mock('src/components/card-movie-small/index.jsx', () => ({
  __esModule: true,
  default: jest.fn(({ cardData }) => <div data-testid="card-movie-small-link">{cardData?.title || cardData?.name }</div>),
}));

beforeEach(() => {
  CardMovieSmall.mockClear();
});
it('right render of data and right calls of child item component', () => {
  render(
    <ListGridMovies list={testDbHelpers.moviesPopular.results} />,
  );
  const indexLastElement = testDbHelpers.moviesPopular.results.length - 1;
  expect(CardMovieSmall).toHaveBeenCalledTimes(testDbHelpers.moviesPopular.results.length);
  expect(CardMovieSmall.mock.calls[0][0])
    .toEqual({ cardData: { ...testDbHelpers.moviesPopular.results[0] } });

  expect(CardMovieSmall.mock.calls[indexLastElement][0])
    .toEqual({ cardData: { ...testDbHelpers.moviesPopular.results[indexLastElement] } });

  expect(screen.getAllByTestId('card-movie-small-link')).toHaveLength(testDbHelpers.moviesPopular.results.length);
});

it('right classes', () => {
  render(
    <ListGridMovies list={[testDbHelpers.moviesPopular.results[0]]} />,
  );
  const items = screen.getAllByTestId('card-grid-items-small');
  expect(items).toHaveLength(1);
  expect(items[0]).toHaveClass('card-grid-items-small');
});
