import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import moviesPopularExample from 'src/utils/movies-popular.example';
import moviesRatedExample from 'src/utils/movies-rated-example';
import linkRoutes from 'src/utils/link-routes';
import appResourcesPath from 'src/utils/app-resources-path';
import ListGridMovies from 'src/components/list-movie-grid';
import CardMovieSmall from 'src/components/card-movie-small';

jest.mock('src/components/card-movie-small/index.jsx', () => ({
  __esModule: true,
  default: jest.fn(({ cardData }) => <div data-testid="card-movie-small-link">{cardData?.title || cardData?.name }</div>),
}));

beforeEach(() => {
  CardMovieSmall.mockClear();
});
it('right render of data and right calls of child item component', () => {
  render(
    <ListGridMovies list={moviesPopularExample.results} />,
  );
  const indexLastElement = moviesPopularExample.results.length - 1;
  expect(CardMovieSmall).toHaveBeenCalledTimes(moviesPopularExample.results.length);
  expect(CardMovieSmall.mock.calls[0][0])
    .toEqual({ cardData: { ...moviesPopularExample.results[0] } });

  expect(CardMovieSmall.mock.calls[indexLastElement][0])
    .toEqual({ cardData: { ...moviesPopularExample.results[indexLastElement] } });

  expect(screen.getAllByTestId('card-movie-small-link')).toHaveLength(moviesPopularExample.results.length);
});

it('right classes', () => {
  render(
    <ListGridMovies list={[moviesPopularExample.results[0]]} />,
  );
  const items = screen.getAllByTestId('card-grid-items-small');
  expect(items).toHaveLength(1);
  expect(items[0]).toHaveClass('card-grid-items-small');
});
