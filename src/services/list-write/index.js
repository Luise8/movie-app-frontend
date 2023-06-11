import { postWithToken, putWithToken, deleteWithToken } from '../fetch-with-token-methods';
import { apiURLs } from '../settings';

// LIST WRITE FUNCTIONS
export async function createList({ name, description = '', id } = {}) {
  if (typeof name !== 'string' || name === ''
    || typeof description !== 'string'
    || typeof id !== 'string' || id === ''
  ) {
    throw new Error('wrong field');
  }
  return postWithToken({ url: apiURLs.createList(id), body: { name, description } });
}

export async function editList({
  name, description, listId, userId, movies,
}) {
  if ((typeof name !== 'string' && name !== undefined)
    || name === ''
  || (typeof description !== 'string' && description !== undefined)
    || (!Array.isArray(movies) && movies !== undefined)
    || typeof listId !== 'string' || listId === ''
    || typeof userId !== 'string' || userId === ''
  ) {
    throw new Error('wrong field');
  }
  const body = {};
  if (name) body.name = name;
  if (description) body.description = description;
  if (movies) body.movies = movies.slice();
  return putWithToken({ url: apiURLs.editList({ userId, listId }), body });
}

export async function deleteList({ userId, listId }) {
  if (typeof listId !== 'string' || listId === ''
    || typeof userId !== 'string' || userId === '') {
    throw new Error('wrong field');
  }
  return deleteWithToken(apiURLs.deleteList({ userId, listId }));
}
