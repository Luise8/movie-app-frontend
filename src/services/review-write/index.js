import { postWithToken, putWithToken, deleteWithToken } from '../fetch-with-token-methods';
import { apiURLs } from '../settings';

// REVIEW WRITE FUNCTIONS
export async function createReview({ title, body, id } = {}) {
  if (typeof title !== 'string' || title === ''
    || typeof body !== 'string' || body === ''
    || typeof id !== 'string' || id === ''
  ) {
    throw new Error('wrong field');
  }
  return postWithToken({ url: apiURLs.createReview(id), body: { title, body } });
}

export async function editReview({
  title, body, reviewId, movieId,
}) {
  if (typeof title !== 'string' || title === ''
    || typeof body !== 'string' || body === ''
    || typeof movieId !== 'string' || movieId === ''
    || typeof reviewId !== 'string' || reviewId === ''
  ) {
    throw new Error('wrong field');
  }
  return putWithToken({ url: apiURLs.editReview({ movieId, reviewId }), body: { title, body } });
}

export async function deleteReview({ movieId, reviewId }) {
  if (typeof reviewId !== 'string' || reviewId === ''
    || typeof movieId !== 'string' || movieId === '') {
    throw new Error('wrong field');
  }
  return deleteWithToken(apiURLs.deleteReview({ movieId, reviewId }));
}
