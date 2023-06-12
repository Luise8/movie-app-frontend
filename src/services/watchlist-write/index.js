import { putWithToken } from 'src/services/fetch-with-token-methods';
import { apiURLs } from 'src/services/settings';

// WATCHLIST WRITE FUNCTIONS
export default async function editWatchist({
  userId, movies,
}) {
  if (typeof userId !== 'string' || userId === ''
    || (!Array.isArray(movies))) {
    throw new Error('wrong field');
  }

  return putWithToken({ url: apiURLs.editWatchlist(userId), body: { movies } });
}
