const linkRoutes = {
  cardMovieSmall: (id) => `/movie/${id}`,
  cardReviewUser: (id) => `/movie/${id}`,
  cardReviewMovie: (id) => `/user/${id}`,
  cardRateUser: (id) => `/movie/${id}`,
  cardMovieMedium: (id) => `/movie/${id}`,
  cardMovieEditItem: (id) => `/movie/${id}`,
  ListMovieItem: ({ userId, listId }) => `/user/${userId}/lists/${listId}`,
  responsiveAppBar: {
    profile: (id) => `/user/${id}`,
    account: '/user-edit-form',
    dashboard: '/',
    registration: '/registration',
    popular: '/popular',
    trending: '/trending',
    rated: '/rated',
  },
  modalSearch: {
    movie: (id) => `/movie/${id}`,
    query: (q) => `/search/${encodeURIComponent(q)}`,
  },
  movie: (id) => `movie/${id}`,
  reviewsMovie: (id) => `/movie/${id}`,
  reviewOneMovie: (id) => `movie/${id}/reviews`,
  footer: {
    website: 'https://luisegamez.netlify.app/',
    github: 'https://github.com/Luise8',
    linkedin: 'https://www.linkedin.com/in/luis-e-gamez-prado/',
  },
  userProfile: (id) => `/user/${id}`,
  oneListUser: ({ userId, listId }) => `/list-edit-form/${userId}/${listId}`,
  listEditForm: ({ userId, listId }) => `/user/${userId}/lists/${listId}`,
  watchlist: '/watchlist-form',
  watchlistForm: (id) => `/user/${id}/watchlist`,
};

export default linkRoutes;
