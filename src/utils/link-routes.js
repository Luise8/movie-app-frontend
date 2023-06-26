const linkRoutes = {
  cardMovieSmall: (id) => `/movie/${id}`,
  cardReviewUser: (id) => `/movie/${id}`,
  cardReviewMovie: (id) => `/user/${id}`,
  cardRateUser: (id) => `/movie/${id}`,
  cardMovieMedium: (id) => `/movie/${id}`,
  cardMovieEditItem: (id) => `/movie/${id}`,
  movie: (id) => `movie/${id}`,
  reviewsMovie: (id) => `movie/${id}/reviews`,
  reviewOneMovie: (id) => `movie/${id}/reviews`,

};

export default linkRoutes;
