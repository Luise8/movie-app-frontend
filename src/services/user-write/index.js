import { postWithToken, putWithToken, deleteWithToken } from '../fetch-with-token-methods';
import { apiURLs } from '../settings';

// USER WRITE FUNCTIONS
export async function createUser({ username, password }) {
  if (typeof username !== 'string' || username === ''
  || typeof password !== 'string' || password === '') {
    throw new Error('wrong field');
  }
  return postWithToken({ url: apiURLs.createUser, body: { username, password } });
}

export async function editUser({ username, password, id }) {
  if (typeof username !== 'string' || username === ''
  || typeof password !== 'string' || password === ''
  || typeof id !== 'string' || id === '') {
    throw new Error('wrong field');
  }
  return putWithToken({ url: apiURLs.editUser(id), body: { username, password } });
}

export async function deleteUser(id) {
  if (typeof id !== 'string' || id === '') {
    throw new Error('wrong field');
  }
  return deleteWithToken(apiURLs.deleteUser(id));
}
