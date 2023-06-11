import { postWithToken, putWithToken, deleteWithToken } from '../fetch-with-token-methods';
import { apiURLs } from '../settings';

// RATE WRITE FUNCTIONS
export async function createRate({ value, id } = {}) {
  if (typeof value !== 'number'
    || value < 1 || value > 10 || !Number.isInteger(value)
    || typeof id !== 'string' || id === ''
  ) {
    throw new Error('wrong field');
  }
  return postWithToken({ url: apiURLs.createRate(id), body: { value } });
}

export async function editRate({
  value, rateId, movieId,
}) {
  if (typeof value !== 'number'
    || value < 1 || value > 10 || !Number.isInteger(value)
    || typeof movieId !== 'string' || movieId === ''
    || typeof rateId !== 'string' || rateId === ''
  ) {
    throw new Error('wrong field');
  }
  return putWithToken({ url: apiURLs.editRate({ movieId, rateId }), body: { value } });
}

export async function deleteRate({ movieId, rateId }) {
  if (typeof rateId !== 'string' || rateId === ''
    || typeof movieId !== 'string' || movieId === '') {
    throw new Error('wrong field');
  }
  return deleteWithToken(apiURLs.deleteRate({ movieId, rateId }));
}
