const linkRoutes = {
  cardMovieSmall: (id) => `/movie/${id}`,
  cardReviewUser: {
    movie: (id) => `/movie/${id}`,
    editReview: (id) => `/review-form/${id}`,
  },
  cardReviewMovie: (id) => `/user/${id}`,
  cardRateUser: {
    movie: (id) => `/movie/${id}`,
    editRate: (id) => `/rate-form/${id}`,
  },
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
  home: {
    popular: '/popular',
    trending: '/trending',
    rated: '/rated',
    latest: '/latest',
  },
  movie: {
    genre: (genre) => `/genre/${genre}`,
    reviews: (movieId) => `/movie/${movieId}/reviews`,
    AddReview: (movieId) => `/review-form/${movieId}`,
    AddRate: (movieId) => `/rate-form/${movieId}`,
    registration: '/registration',
  },
  user: {
    lists: (id) => `/user/${id}/lists`,
    rates: (id) => `/user/${id}/rates`,
    reviews: (id) => `/user/${id}/reviews`,
    watchlist: (id) => `/user/${id}/watchlist`,
    editUser: '/user-edit-form',
  },
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
  listCreateForm: (userId) => `/user/${userId}/lists`,
  watchlist: '/watchlist-form',
  watchlistForm: (id) => `/user/${id}/watchlist`,
  signUp: '/login',
  logIn: '/',
  reviewForm: {
    reviews: (id) => `/user/${id}/reviews`,
    movie: (id) => `/movie/${id}`,
  },
  rateForm: {
    rates: (id) => `/user/${id}/rates`,
    movie: (id) => `/movie/${id}`,
  },
  userEditForm: (userId) => `/user/${userId}`,
};

export default linkRoutes;
