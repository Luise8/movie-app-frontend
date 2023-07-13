const baseApiURL = import.meta.env.VITE_API_URL;
const recaptchaKey = import.meta.env.VITE_RECAPTCHA_KEY;
const apiURLs = {

  // User
  createUser: `${baseApiURL}/users`,
  deleteUser: (id) => `${baseApiURL}/users/${id}`,
  editUser: (id) => `${baseApiURL}/users/${id}`,

  // Get resorces of user
  getUser: (id) => `${baseApiURL}/users/${id}`,
  getRatesUser: ({ id, page }) => `${baseApiURL}/users/${id}/rates?page=${page}&pageSize=20`,
  getReviewsUser: ({ id, page }) => `${baseApiURL}/users/${id}/reviews?page=${page}&pageSize=20`,
  getWatchlistUser: ({ id, page }) => `${baseApiURL}/users/${id}/watchlist?page=${page}&pageSize=20`,
  getWatchlistUserLight: (id) => `${baseApiURL}/users/${id}/watchlist?light=true`,
  getListsUser: ({ id, page }) => `${baseApiURL}/users/${id}/lists?page=${page}&pageSize=20`,
  getOneListUser: ({
    userId, listId, page,
  }) => `${baseApiURL}/users/${userId}/lists/${listId}?page=${page}&pageSize=20`,
  getOneListUserLight: ({ userId, listId }) => `${baseApiURL}/users/${userId}/lists/${listId}?light=true`,

  // List
  createList: (id) => `${baseApiURL}/users/${id}/lists`,
  editList: ({ userId, listId }) => `${baseApiURL}/users/${userId}/lists/${listId}`,
  deleteList: ({ userId, listId }) => `${baseApiURL}/users/${userId}/lists/${listId}`,

  // Watchlist
  editWatchlist: (id) => `${baseApiURL}/users/${id}/watchlist`,

  // Get movie data
  getMovieDetail: (id) => `${baseApiURL}/movies/${id}/detail`,
  getMovieTmdb: (id) => `${baseApiURL}/movies/${id}/tmdb`,
  getReviewsMovie: ({ id, page }) => `${baseApiURL}/movies/${id}/reviews?page=${page}&pageSize=20`,
  getOneReviewMovie: ({ movieId, reviewId }) => `${baseApiURL}/movies/${movieId}/reviews/${reviewId}`,
  getLatestMovies: (page) => `${baseApiURL}/movies/latest?page=${page}`,
  getPopularMovies: (page) => `${baseApiURL}/movies/popular?page=${page}`,
  getTrendingMovies: (page) => `${baseApiURL}/movies/trending?page=${page}`,
  getRatedMovies: (page) => `${baseApiURL}/movies/rated?page=${page}&pageSize=1`,
  getMoviesByGenre: ({ page, genres }) => `${baseApiURL}/movies/genre?genres=${genres}&page=${page}`,
  // Enconded query
  getMoviesBySearch: ({ page, query, isEncoded }) => (isEncoded ? `${baseApiURL}/movies/search?query=${query}&page=${page}` : `${baseApiURL}/movies/search?query=${encodeURIComponent(query)}&page=${page}`),
  getSpecificReviewUser: (id) => `${baseApiURL}/movies/${id}/reviewUser`,
  getSpecificRateUser: (id) => `${baseApiURL}/movies/${id}/rateUser`,

  // Reviews
  createReview: (id) => `${baseApiURL}/movies/${id}/reviews`,
  editReview: ({ movieId, reviewId }) => `${baseApiURL}/movies/${movieId}/reviews/${reviewId}`,
  deleteReview: ({ movieId, reviewId }) => `${baseApiURL}/movies/${movieId}/reviews/${reviewId}`,

  // Rate
  createRate: (id) => `${baseApiURL}/movies/${id}/rates`,
  editRate: ({ movieId, rateId }) => `${baseApiURL}/movies/${movieId}/rates/${rateId}`,
  deleteRate: ({ movieId, rateId }) => `${baseApiURL}/movies/${movieId}/rates/${rateId}`,

  // Auth
  authLogIn: `${baseApiURL}/auth/login`,
  authLogoOut: `${baseApiURL}/auth/logout`,
  authStatus: `${baseApiURL}/auth/status`,

};

export { apiURLs, recaptchaKey, baseApiURL };
