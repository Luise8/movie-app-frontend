import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import linkRoutes from 'src/utils/link-routes';
import testDbHelpers from 'src/utils/test-db-helpers';
import { ThemeProvider } from '@emotion/react';
import darkTheme from 'src/utils/darkTheme';
import testHelperFunctions from 'src/utils/test-helper-functions';
import ListMovieLists from 'src/components/list-movie-lists';

it('right render right number of items', () => {
  const { results } = testDbHelpers.listsUser;

  render(
    <MemoryRouter>
      <ListMovieLists list={results} />
    </MemoryRouter>,
  );

  expect(screen.getAllByTestId('list-item')).toHaveLength(results.length);
});

it('right render of items', () => {
  const item = testDbHelpers.listsUser.results[0];

  render(
    <MemoryRouter>
      <ListMovieLists list={[item]} />
    </MemoryRouter>,
  );

  expect(screen.getByText(item.name)).toBeInTheDocument();

  expect(screen.getByText(`${item.movies.length} movies`)).toBeInTheDocument();

  expect(screen.getByText(new RegExp(new Date(item.date).toUTCString(), 'i'))).toBeInTheDocument();

  expect(screen.getByTestId('list-item')).toHaveAttribute('href', linkRoutes.ListMovieItem({ userId: item.userId, listId: item.id }));
});

it('right classes and inline styles', () => {
  const item = testDbHelpers.listsUser.results[0];
  render(
    <MemoryRouter>
      <ThemeProvider theme={darkTheme}>
        <ListMovieLists list={[item]} />
      </ThemeProvider>
    </MemoryRouter>,
  );

  expect(screen.getByText(item.name)).toHaveStyle(`color: ${darkTheme.palette.primary.light}`);
});
