import { getWithToken } from '../fetch-with-token-methods';
import { apiURLs } from '../settings';

// GET FUNCTIONS
export async function getMovieDetail(id) {
  if (typeof id !== 'string' || id === '') {
    throw new Error('wrong field');
  }
  return getWithToken(apiURLs.getMovieDetail(id));
}

export async function getMovieTmdb(id) {
  if (typeof id !== 'string' || id === '') {
    throw new Error('wrong field');
  }
  return getWithToken(apiURLs.getMovieTmdb(id));
}

export async function getReviewsMovie({ page = 0, id } = {}) {
  if (typeof id !== 'string' || id === '' || typeof page !== 'number') {
    throw new Error('wrong field');
  }
  return getWithToken(apiURLs.getReviewsMovie({ id, page }));
}

export async function getOneReviewMovie({ movieId, reviewId }) {
  if (typeof movieId !== 'string' || movieId === ''
    || typeof reviewId !== 'string' || reviewId === '') {
    throw new Error('wrong field');
  }
  return getWithToken(apiURLs.getOneReviewMovie({ movieId, reviewId }));
}

export async function getLatestMovies(page = 1) {
  if (typeof page !== 'number') {
    throw new Error('wrong field');
  }
  return getWithToken(apiURLs.getLatestMovies(page));
}

export async function getPopularMovies(page = 1) {
  if (typeof page !== 'number') {
    throw new Error('wrong field');
  }
  return getWithToken(apiURLs.getPopularMovies(page));
}

export async function getTrendingMovies(page = 1) {
  if (typeof page !== 'number') {
    throw new Error('wrong field');
  }
  return getWithToken(apiURLs.getTrendingMovies(page));
}

export async function getRatedMovies(page = 1) {
  if (typeof page !== 'number') {
    throw new Error('wrong field');
  }
  return getWithToken(apiURLs.getRatedMovies(page));
}

export async function getMoviesByGenre({ genres, page = 1 } = {}) {
  if (typeof genres !== 'string' || genres === '' || typeof page !== 'number') {
    throw new Error('wrong field');
  }
  return getWithToken(apiURLs.getMoviesByGenre({ genres, page }));
}

export async function getMoviesBySearch({ query = '', page = 1 } = {}) {
  if (typeof query !== 'string' || typeof page !== 'number') {
    throw new Error('wrong field');
  }
  return getWithToken(apiURLs.getMoviesBySearch({ query, page }));
}

export async function getSpecificReviewUser(id) {
  if (typeof id !== 'string' || id === '') {
    throw new Error('wrong field');
  }
  return getWithToken(apiURLs.getSpecificReviewUser(id));
}

export async function getSpecificRateUser(id) {
  if (typeof id !== 'string' || id === '') {
    throw new Error('wrong field');
  }
  return getWithToken(apiURLs.getSpecificRateUser(id));
}

export async function getUser(id) {
  if (typeof id !== 'string' || id === '') {
    throw new Error('wrong field');
  }
  return getWithToken(apiURLs.getUser(id));
}

export async function getRatesUser({ id, page = 0 } = {}) {
  if (typeof id !== 'string' || id === '' || typeof page !== 'number') {
    throw new Error('wrong field');
  }
  return getWithToken(apiURLs.getRatesUser({ id, page }));
}

export async function getReviewsUser({ id, page = 0 } = {}) {
  if (typeof id !== 'string' || id === '' || typeof page !== 'number') {
    throw new Error('wrong field');
  }
  return getWithToken(apiURLs.getReviewsUser({ id, page }));
}

export async function getWatchlistUser({ id, page = 0 } = {}) {
  if (typeof id !== 'string' || id === '' || typeof page !== 'number') {
    throw new Error('wrong field');
  }
  return getWithToken(apiURLs.getWatchlistUser({ id, page }));
}

export async function getWatchlistUserLight(id) {
  if (typeof id !== 'string' || id === '') {
    throw new Error('wrong field');
  }
  return getWithToken(apiURLs.getWatchlistUserLight(id));
}

export async function getListsUser({ id, page = 0 } = {}) {
  if (typeof id !== 'string' || id === '' || typeof page !== 'number') {
    throw new Error('wrong field');
  }
  return getWithToken(apiURLs.getListsUser({ id, page }));
}

export async function getOneListUser({ userId, listId, page = 0 } = {}) {
  if (typeof userId !== 'string' || userId === ''
    || typeof listId !== 'string' || listId === ''
    || typeof page !== 'number') {
    throw new Error('wrong field');
  }
  return getWithToken(apiURLs.getOneListUser({ userId, listId, page }));
}

export async function getOneListUserLight({ userId, listId }) {
  if (typeof userId !== 'string' || userId === ''
    || typeof listId !== 'string' || listId === '') {
    throw new Error('wrong field');
  }
  return getWithToken(apiURLs.getOneListUserLight({ userId, listId }));
}
