import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
