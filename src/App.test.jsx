// app.test.js
import { screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { renderWithRouter, mockUser } from 'src/app-test-utils';
import App from 'src/App';
import { useUserAuth } from 'src/context/auth';

// mock apiURLs
jest.mock('src/services/settings');

// mock getWithToken
jest.mock('src/services/fetch-with-token-methods', () => ({
  getWithToken: jest.fn(() => Promise.resolve({ data: 'some data' })),
}));

// mock useUserAuth hook
jest.mock('src/context/auth', () => ({
  useUserAuth: jest.fn(() => ({
    user: mockUser,
    fetcAndSethUserData: jest.fn(),
    logInContext: jest.fn(),
    logOutContext: jest.fn(),
  })),
}));

test('full app rendering default page', async () => {
  renderWithRouter(<App />);
  expect(screen.getByTestId(/home/i)).toBeInTheDocument();
});

describe('landing on a existent pages', () => {
  it('user', () => {
    renderWithRouter(<App />, { route: '/user/123' });
    expect(screen.getByTestId(/user/i)).toBeInTheDocument();
  });

  it('user-lists', () => {
    renderWithRouter(<App />, { route: '/user/123/lists' });
    expect(screen.getByTestId(/user-lists/i)).toBeInTheDocument();
  });

  it('user-one-list', () => {
    renderWithRouter(<App />, { route: '/user/123/lists/555' });
    expect(screen.getByTestId(/user-one-list/i)).toBeInTheDocument();
  });

  it('user-rates', () => {
    renderWithRouter(<App />, { route: '/user/123/rates' });
    expect(screen.getByTestId(/user-rates/i)).toBeInTheDocument();
  });

  it('user-reviews', () => {
    renderWithRouter(<App />, { route: '/user/123/reviews' });
    expect(screen.getByTestId(/user-reviews/i)).toBeInTheDocument();
  });

  it('user-watchlist', () => {
    renderWithRouter(<App />, { route: '/user/123/watchlist' });
    expect(screen.getByTestId(/user-watchlist/i)).toBeInTheDocument();
  });

  it('movie', () => {
    renderWithRouter(<App />, { route: '/movie/123' });
    expect(screen.getByTestId(/movie/i)).toBeInTheDocument();
  });

  it('movie-reviews', () => {
    renderWithRouter(<App />, { route: '/movie/123/reviews' });
    expect(screen.getByTestId(/movie-reviews/i)).toBeInTheDocument();
  });

  it('user-edit-form', () => {
    renderWithRouter(<App />, { route: '/user-edit-form' });
    expect(screen.getByTestId(/user-edit-form/i)).toBeInTheDocument();
  });

  it('review-form', () => {
    renderWithRouter(<App />, { route: '/review-form/123' });
    expect(screen.getByTestId(/review-form/i)).toBeInTheDocument();
  });

  it('rate-form', () => {
    renderWithRouter(<App />, { route: '/rate-form/123' });
    expect(screen.getByTestId(/rate-form/i)).toBeInTheDocument();
  });

  it('watchlist-form', () => {
    renderWithRouter(<App />, { route: '/watchlist-form' });
    expect(screen.getByTestId(/watchlist-form/i)).toBeInTheDocument();
  });

  it('list-create-form', () => {
    renderWithRouter(<App />, { route: '/list-create-form' });
    expect(screen.getByTestId(/list-create-form/i)).toBeInTheDocument();
  });

  it('list-edit-form', () => {
    renderWithRouter(<App />, { route: '/list-edit-form/123/132' });
    expect(screen.getByTestId(/list-edit-form/i)).toBeInTheDocument();
  });

  it('registration', () => {
    useUserAuth.mockImplementationOnce(() => ({
      user: null,
      fetcAndSethUserData: jest.fn(),
      logInContext: jest.fn(),
      logOutContext: jest.fn(),
    }));
    renderWithRouter(<App />, { route: '/registration' });
    expect(screen.getByTestId(/registration/i)).toBeInTheDocument();
  });

  it('login', () => {
    useUserAuth.mockImplementationOnce(() => ({
      user: null,
      fetcAndSethUserData: jest.fn(),
      logInContext: jest.fn(),
      logOutContext: jest.fn(),
    }));
    renderWithRouter(<App />, { route: '/login' });
    expect(screen.getByTestId(/login/i)).toBeInTheDocument();
  });

  it('signup', () => {
    useUserAuth.mockImplementationOnce(() => ({
      user: null,
      fetcAndSethUserData: jest.fn(),
      logInContext: jest.fn(),
      logOutContext: jest.fn(),
    }));
    renderWithRouter(<App />, { route: '/signup' });
    expect(screen.getByTestId(/signup/i)).toBeInTheDocument();
  });

  it('latest', () => {
    renderWithRouter(<App />, { route: '/latest' });
    expect(screen.getByTestId(/latest/i)).toBeInTheDocument();
  });

  it('popular', () => {
    renderWithRouter(<App />, { route: '/popular' });
    expect(screen.getByTestId(/popular/i)).toBeInTheDocument();
  });

  it('trending', () => {
    renderWithRouter(<App />, { route: '/trending' });
    expect(screen.getByTestId(/trending/i)).toBeInTheDocument();
  });

  it('rated', () => {
    renderWithRouter(<App />, { route: '/rated' });
    expect(screen.getByTestId(/rated/i)).toBeInTheDocument();
  });

  it('genre', () => {
    renderWithRouter(<App />, { route: '/genre/28' });
    expect(screen.getByTestId(/genre/i)).toBeInTheDocument();
  });

  it('search', () => {
    renderWithRouter(<App />, { route: '/search/house' });
    expect(screen.getByTestId(/search/i)).toBeInTheDocument();
  });

  it('credits', () => {
    renderWithRouter(<App />, { route: '/credits' });
    expect(screen.getByTestId(/credits/i)).toBeInTheDocument();
  });

  it('error', () => {
    renderWithRouter(<App />, { route: '/error' });
    expect(screen.getByTestId(/error/i)).toBeInTheDocument();
  });
});

test('landing on a bad page', () => {
  renderWithRouter(<App />, { route: '/something-that-does-not-match' });

  expect(screen.getByTestId(/404/i)).toBeInTheDocument();
});
