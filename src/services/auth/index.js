import {
  getWithToken, postWithToken,
} from 'src/services/fetch-with-token-methods';

import { apiURLs } from 'src/services/settings';

export async function logIn({ username, password }) {
  if (typeof username !== 'string' || username === ''
    || typeof password !== 'string' || password === '') {
    throw new Error('wrong field');
  }
  return postWithToken({ url: apiURLs.authLogIn, body: { username, password } });
}

export async function logOut() {
  return postWithToken({ url: apiURLs.authLogoOut });
}

export async function authStatus() {
  return getWithToken(apiURLs.authStatus);
}
