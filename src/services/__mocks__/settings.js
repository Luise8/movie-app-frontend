const baseApiURL = 'apiUrl';
const recaptchaKey = '123';
const apiURLs = {

  // User
  createUser: `${baseApiURL}/users`,
  deleteUser: jest.fn((id) => `${baseApiURL}/users/${id}`),
  editUser: jest.fn((id) => `${baseApiURL}/users/${id}`),

  // Get resorces of user
  getUser: jest.fn((id) => `${baseApiURL}/users/${id}`),
  getRatesUser: jest.fn(({ id, page }) => `${baseApiURL}/users/${id}/rates?page=${page}&pageSize=20`),
  getReviewsUser: jest.fn(({ id, page }) => `${baseApiURL}/users/${id}/reviews?page=${page}&pageSize=20`),
  getWatchlistUser: jest.fn(({ id, page }) => `${baseApiURL}/users/${id}/watchlist?page=${page}&pageSize=20`),
  getWatchlistUserLight: jest.fn((id) => `${baseApiURL}/users/${id}/watchlist?light=true`),
  getListsUser: jest.fn(({ id, page }) => `${baseApiURL}/users/${id}/lists?page=${page}&pageSize=20`),
  getOneListUser: jest.fn(({
    userId, listId, page,
  }) => `${baseApiURL}/users/${userId}/lists/${listId}?page=${page}&pageSize=20`),
  getOneListUserLight: jest.fn(({ userId, listId }) => `${baseApiURL}/users/${userId}/lists/${listId}?light=true`),
  getAllListUserLight: jest.fn((userId) => `${baseApiURL}/users/${userId}/all-lists-light`),

  // List
  createList: jest.fn((id) => `${baseApiURL}/users/${id}/lists`),
  editList: jest.fn(({ userId, listId }) => `${baseApiURL}/users/${userId}/lists/${listId}`),
  deleteList: jest.fn(({ userId, listId }) => `${baseApiURL}/users/${userId}/lists/${listId}`),

  // Watchlist
  editWatchlist: jest.fn((id) => `${baseApiURL}/users/${id}/watchlist`),

  // Get movie data
  getMovieDetail: jest.fn((id) => `${baseApiURL}/movies/${id}/detail`),
  getMovieTmdb: jest.fn((id) => `${baseApiURL}/movies/${id}/tmdb`),
  getReviewsMovie: jest.fn(({ id, page }) => `${baseApiURL}/movies/${id}/reviews?page=${page}&pageSize=20`),
  getOneReviewMovie: jest.fn(({ movieId, reviewId }) => `${baseApiURL}/movies/${movieId}/reviews/${reviewId}`),
  getLatestMovies: jest.fn((page) => `${baseApiURL}/movies/latest?page=${page}`),
  getPopularMovies: jest.fn((page) => `${baseApiURL}/movies/popular?page=${page}`),
  getTrendingMovies: jest.fn((page) => `${baseApiURL}/movies/trending?page=${page}`),
  getRatedMovies: jest.fn((page) => `${baseApiURL}/movies/rated?page=${page}`),
  getMoviesByGenre: jest.fn(({ page, genres }) => `${baseApiURL}/movies/genre?genres=${genres}&page=${page}`),
  // Enconded query
  getMoviesBySearch: jest.fn(({ page, query, isEncoded }) => (isEncoded ? `${baseApiURL}/movies/search?query=${query}&page=${page}` : `${baseApiURL}/movies/search?query=${encodeURIComponent(query)}&page=${page}`)),
  getSpecificReviewUser: jest.fn((id) => `${baseApiURL}/movies/${id}/reviewUser`),
  getSpecificRateUser: jest.fn((id) => `${baseApiURL}/movies/${id}/ratewUser`),

  // Reviews
  createReview: jest.fn((id) => `${baseApiURL}/movies/${id}/reviews`),
  editReview: jest.fn(({ movieId, reviewId }) => `${baseApiURL}/movies/${movieId}/reviews/${reviewId}`),
  deleteReview: jest.fn(({ movieId, reviewId }) => `${baseApiURL}/movies/${movieId}/reviews/${reviewId}`),

  // Rate
  createRate: jest.fn((id) => `${baseApiURL}/movies/${id}/rates`),
  editRate: jest.fn(({ movieId, rateId }) => `${baseApiURL}/movies/${movieId}/rates/${rateId}`),
  deleteRate: jest.fn(({ movieId, rateId }) => `${baseApiURL}/movies/${movieId}/rates/${rateId}`),

  // Auth
  authLogIn: `${baseApiURL}/auth/login`,
  authLogoOut: `${baseApiURL}/auth/logout`,
  authStatus: `${baseApiURL}/auth/status`,

};

export { apiURLs, recaptchaKey, baseApiURL };
