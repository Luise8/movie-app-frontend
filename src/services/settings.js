const apiURL = import.meta.env.VITE_API_URL;
const recaptchaKey = import.meta.env.VITE_RECAPTCHA_KEY;
const apiURLs = {

  // User
  createUser: `${apiURL}/users`,
  deleteUser: (id) => `${apiURL}/users/${id}`,
  editUser: (id) => `${apiURL}/users/${id}`,

  // Get resorces of user
  getUser: (id) => `${apiURL}/users/${id}`,
  getRatesUser: ({ id, page }) => `${apiURL}/users/${id}/rates?page=${page || 1}`,
  getReviewsUser: ({ id, page }) => `${apiURL}/users/${id}/reviews?page=${page || 1}`,
  getWatchlistUser: (id) => `${apiURL}/users/${id}/watchlist`,
  getWatchlistUserLight: (id) => `${apiURL}/users/${id}/watchlist?light=true`,
  getListsUser: ({ id, page }) => `${apiURL}/users/${id}/lists?page=${page || 1}`,
  getOneListUser: ({ userId, listId }) => `${apiURL}/users/${userId}/lists/${listId}`,
  getOneListUserLight: ({ userId, listId }) => `${apiURL}/users/${userId}/lists/${listId}?light=true`,

  // List
  createList: (id) => `${apiURL}/users/${id}/lists`,
  editList: ({ userId, listId }) => `${apiURL}/users/${userId}/lists/${listId}`,
  deleteList: ({ userId, listId }) => `${apiURL}/users/${userId}/lists/${listId}`,

  // Watchlist
  editWatchlist: (id) => `${apiURL}/users/${id}/watchlist`,

  // Get movie data
  getMovieDetail: (id) => `${apiURL}/movies/${id}/detail`,
  getMovieTmdb: (id) => `${apiURL}/movies/${id}/tmdb`,
  getReviewsMovie: ({ id, page }) => `${apiURL}/movies/${id}/reviews?page=${page || 1}`,
  getOneReviewMovie: ({ movieId, reviewId }) => `${apiURL}/movies/${movieId}/reviews/${reviewId}`,
  getLatestMovies: (page) => `${apiURL}/movies/latest?page=${page || 1}`,
  getPopularMovies: (page) => `${apiURL}/movies/popular?page=${page || 1}`,
  getTrendingMovies: (page) => `${apiURL}/movies/trending?page=${page || 1}`,
  getRatedMovies: (page) => `${apiURL}/movies/rated?page=${page || 1}`,
  getMoviesByGenre: ({ page, genres }) => `${apiURL}/movies/genre?genres=${genres}&page=${page || 1}`,
  // Enconded query
  getMoviesBySearch: ({ page, query }) => `${apiURL}/movies/search?query=${encodeURIComponent(query)}&page=${page || 1}`,
  getSpecificReviewUser: (id) => `${apiURL}/movies/${id}/reviewUser`,
  getSpecificRateUser: (id) => `${apiURL}/movies/${id}/ratewUser`,

  // Reviews
  createReview: (id) => `${apiURL}/movies/${id}/reviews`,
  editReview: ({ movieId, reviewId }) => `${apiURL}/movies/${movieId}/reviews/${reviewId}`,
  deleteReview: ({ movieId, reviewId }) => `${apiURL}/movies/${movieId}/reviews/${reviewId}`,

  // Rate
  createRate: (id) => `${apiURL}/movies/${id}/rates`,
  editRate: ({ movieId, rateId }) => `${apiURL}/movies/${movieId}/rates/${rateId}`,
  deleteRate: ({ movieId, rateId }) => `${apiURL}/movies/${movieId}/rates/${rateId}`,

  // Auth
  authLogIn: `${apiURL}/auth/login`,
  authLogoOut: `${apiURL}/auth/logout`,
  authStatus: `${apiURL}/auth/status`,

};

export { apiURLs, recaptchaKey };
