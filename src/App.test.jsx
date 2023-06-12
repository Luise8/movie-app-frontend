// app.test.js
import { screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import renderWithRouter from 'src/app-test-utils';
import App from 'src/App';

test('full app rendering default page', async () => {
  renderWithRouter(<App />);
  expect(screen.getByText(/home/i)).toBeInTheDocument();
});

describe('landing on a existent pages', () => {
  it('user', () => {
    renderWithRouter(<App />, { route: '/user/123' });
    expect(screen.getByText(/user/i)).toBeInTheDocument();
  });

  it('user-lists', () => {
    renderWithRouter(<App />, { route: '/user/123/lists' });
    expect(screen.getByText(/lists/i)).toBeInTheDocument();
  });

  it('user-one-lists', () => {
    renderWithRouter(<App />, { route: '/user/123/lists/555' });
    expect(screen.getByText(/list$|list /i)).toBeInTheDocument();
  });

  it('user-rates', () => {
    renderWithRouter(<App />, { route: '/user/123/rates' });
    expect(screen.getByText(/rates/i)).toBeInTheDocument();
  });

  it('user-reviews', () => {
    renderWithRouter(<App />, { route: '/user/123/reviews' });
    expect(screen.getByText(/reviews/i)).toBeInTheDocument();
  });

  it('user-watchlist', () => {
    renderWithRouter(<App />, { route: '/user/123/watchlist' });
    expect(screen.getByText(/watchlist/i)).toBeInTheDocument();
  });

  it('movie', () => {
    renderWithRouter(<App />, { route: '/movie/123' });
    expect(screen.getByText(/movie/i)).toBeInTheDocument();
  });

  it('movie-reviews', () => {
    renderWithRouter(<App />, { route: '/movie/123/reviews' });
    expect(screen.getByText(/reviews/i)).toBeInTheDocument();
  });

  it('movie-one-review', () => {
    renderWithRouter(<App />, { route: '/movie/123/reviews/999' });
    expect(screen.getByText(/review$|review /i)).toBeInTheDocument();
  });

  it('user-edit-form', () => {
    renderWithRouter(<App />, { route: '/user-edit-form' });
    expect(screen.getByText(/edit user/i)).toBeInTheDocument();
  });

  it('review-form', () => {
    renderWithRouter(<App />, { route: '/review-form' });
    expect(screen.getByText(/create review|edit review/i)).toBeInTheDocument();
  });

  it('rate-form', () => {
    renderWithRouter(<App />, { route: '/rate-form' });
    expect(screen.getByText(/create rate|edit rate/i)).toBeInTheDocument();
  });

  it('watchlist-form', () => {
    renderWithRouter(<App />, { route: '/watchlist-form' });
    expect(screen.getByText(/edit watchlist/i)).toBeInTheDocument();
  });

  it('list-create-form', () => {
    renderWithRouter(<App />, { route: '/list-create-form' });
    expect(screen.getByText(/create list/i)).toBeInTheDocument();
  });

  it('list-edit-form', () => {
    renderWithRouter(<App />, { route: '/list-edit-form' });
    expect(screen.getByText(/edit list/i)).toBeInTheDocument();
  });

  it('registration', () => {
    renderWithRouter(<App />, { route: '/registration' });
    expect(screen.getByText(/registration/i)).toBeInTheDocument();
  });

  it('login', () => {
    renderWithRouter(<App />, { route: '/login' });
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('signup', () => {
    renderWithRouter(<App />, { route: '/signup' });
    expect(screen.getByText(/signup/i)).toBeInTheDocument();
  });

  it('latest', () => {
    renderWithRouter(<App />, { route: '/latest' });
    expect(screen.getByText(/latest/i)).toBeInTheDocument();
  });

  it('popular', () => {
    renderWithRouter(<App />, { route: '/popular' });
    expect(screen.getByText(/popular/i)).toBeInTheDocument();
  });

  it('trending', () => {
    renderWithRouter(<App />, { route: '/trending' });
    expect(screen.getByText(/trending/i)).toBeInTheDocument();
  });

  it('rated', () => {
    renderWithRouter(<App />, { route: '/rated' });
    expect(screen.getByText(/rated/i)).toBeInTheDocument();
  });

  it('genre', () => {
    renderWithRouter(<App />, { route: '/genre/28' });
    expect(screen.getByText(/genre/i)).toBeInTheDocument();
  });

  it('search', () => {
    renderWithRouter(<App />, { route: '/search/house' });
    expect(screen.getByText(/search/i)).toBeInTheDocument();
  });

  it('credits', () => {
    renderWithRouter(<App />, { route: '/credits' });
    expect(screen.getByText(/credits/i)).toBeInTheDocument();
  });
});

test('landing on a bad page', () => {
  renderWithRouter(<App />, { route: '/something-that-does-not-match' });

  expect(screen.getByText(/pagenotfound/i)).toBeInTheDocument();
});
