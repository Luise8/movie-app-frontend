import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

const { BrowserRouter } = require('react-router-dom');

// test utils file
export const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: BrowserRouter }),
  };
};

export const mockUser = {
  username: 'userNumber1',
  photo: null,
  bio: '',
  date: '2023-06-12T15:13:09.579Z',
  lists: [
    {
      name: 'List number 1',
      description: 'This is the description of list number 1made by the userNumber1 ',
      date: '2023-06-12T15:13:11.145Z',
      id: '64502ae06dc338b6e80b8c56',
    },
  ],
  watchlist: '6487360529c9c55526a51790',
  id: '64501354c41b5db06e01c5a5',
  reviews: [
    {
      title: 'Third review made',
      body: 'Lorem ipsum dolor sit amet, consectetuer adipiscing entum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitaLorem ipsum dolor sit amet, consectetuer adipiscing entum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitaLorem ipsum dolor sit amet, consectetuer adipiscing entum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitaLorem ipsum dolor sit amet, consectetuer adipiscing entum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitaLorem ipsum dolor sit amet, consectetuer adipiscing entum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vita',
      date: '2023-06-12T15:13:11.144Z',
      userId: '64501354c41b5db06e01c5a5',
      movieId: {
        name: 'The Fast and the Furious',
        photo: 'https://image.tmdb.org/t/p/w185//lgCEntS9mHagxdL5hb3qaV49YTd.jpg',
        release_date: '2001-06-22',
        idTMDB: '9799',
        rateAverage: 5,
        id: '6447e80aa1f0cd363649d594',
      },
      id: '6487360829c9c55526a5181c',
    },
  ],
  rates: [
    {
      value: 5,
      date: '2023-06-12T15:13:11.145Z',
      userId: '64501354c41b5db06e01c5a5',
      movieId: {
        name: 'The Fast and the Furious: Tokyo Drift',
        photo: 'https://image.tmdb.org/t/p/w185//cm2ffqb3XovzA5ZSzyN3jnn8qv0.jpg',
        description: 'In order to avoid a jail sentence, Sean Boswell heads to Tokyo to live with his military father. In a low-rent section of the city, Shaun gets caught up in the underground world of drift racing',
        release_date: '2006-06-03',
        idTMDB: '9615',
        rateAverage: 5,
        id: '6447e80aa1f0cd363649d595',
      },
      id: '64502ae06dc338b6e80b8c5b',
    },
    {
      value: 5,
      date: '2023-06-12T15:13:11.145Z',
      userId: '64501354c41b5db06e01c5a5',
      movieId: {
        name: 'The Fast and the Furious',
        photo: 'https://image.tmdb.org/t/p/w185//lgCEntS9mHagxdL5hb3qaV49YTd.jpg',
        description: "Dominic Toretto is a Los Angeles street racer suspected of masterminding a series of big-rig hijackings. When undercover cop Brian O'Conner infiltrates Toretto's iconoclastic crew, he falls for Toretto's sister and must choose a side: the gang or the LAPD.",
        release_date: '2001-06-22',
        idTMDB: '9799',
        rateAverage: 5,
        id: '6447e80aa1f0cd363649d594',
      },
      id: '64502ae06dc338b6e80b8c5a',
    },
  ],
};

// Mock pages

jest.mock('src/pages/home', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="home" />),
}));

jest.mock('src/pages/404', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="404" />),
}));

jest.mock('src/pages/credits', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="credits" />),
}));

jest.mock('src/pages/error', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="error" />),
}));

jest.mock('src/pages/genre', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="genre" />),
}));

jest.mock('src/pages/latest', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="latest" />),
}));

jest.mock('src/pages/list-create-form', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="list-create-form" />),
}));

jest.mock('src/pages/list-edit-form', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="list-edit-form" />),
}));

jest.mock('src/pages/login', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="login" />),
}));

jest.mock('src/pages/movie', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="movie" />),
}));

jest.mock('src/pages/movie-reviews', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="movie-reviews" />),
}));

jest.mock('src/pages/popular', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="popular" />),
}));

jest.mock('src/pages/rate-form', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="rate-form" />),
}));

jest.mock('src/pages/rated', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="rated" />),
}));

jest.mock('src/pages/registration', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="registration" />),
}));

jest.mock('src/pages/review-form', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="review-form" />),
}));

jest.mock('src/pages/search', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="search" />),
}));

jest.mock('src/pages/signup', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="signup" />),
}));

jest.mock('src/pages/trending', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="trending" />),
}));

jest.mock('src/pages/user', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="user" />),
}));

jest.mock('src/pages/user-edit-form', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="user-edit-form" />),
}));

jest.mock('src/pages/user-lists', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="user-lists" />),
}));

jest.mock('src/pages/user-one-list', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="user-one-list" />),
}));

jest.mock('src/pages/user-rates', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="user-rates" />),
}));

jest.mock('src/pages/user-reviews', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="user-reviews" />),
}));

jest.mock('src/pages/user-watchlist', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="user-watchlist" />),
}));

jest.mock('src/pages/watchlist-form', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="watchlist-form" />),
}));
