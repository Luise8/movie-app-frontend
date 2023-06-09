import editWatchlist from 'src/services/watchlist-write/index';
import { putWithToken } from 'src/services/fetch-with-token-methods';
import { apiURLs, baseApiURL } from 'src/services/settings';

// mock apiURLs
jest.mock('src/services/settings');

// mock putWithToken
jest.mock('src/services/fetch-with-token-methods', () => ({
  putWithToken: jest.fn(),
}));

beforeEach(() => {
  putWithToken.mockClear();
});

describe('editWatchlist', () => {
  const body = {
    movies: ['9799'],
  };
  const userId = '123456789a8798asd7897d4a';
  const urlRight = `${baseApiURL}/users/${userId}/watchlist`;
  beforeAll(() => {
    putWithToken.mockImplementation(() => Promise.resolve(body));
  });
  beforeEach(() => {
    apiURLs.editWatchlist.mockClear();
  });

  it('called with valid arguments', async () => {
    const data = await editWatchlist({ ...body, userId });
    expect(putWithToken).toHaveBeenCalledTimes(1);
    expect(putWithToken).toHaveBeenCalledWith({ url: urlRight, body });
    expect(apiURLs.editWatchlist).toHaveBeenCalledWith(userId);
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid or missing', async () => {
    await expect(editWatchlist({ movies: {}, userId: null })).rejects.toThrow();
    expect(putWithToken).not.toHaveBeenCalled();
  });
});
