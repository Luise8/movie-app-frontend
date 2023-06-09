import * as api from './index';
import { getWithToken } from '../fetch-with-token-methods';
import { apiURLs, baseApiURL } from '../settings';

// mock apiURLs
jest.mock('../settings');

// mock getWithToken
jest.mock('../fetch-with-token-methods', () => ({
  getWithToken: jest.fn(),
}));

beforeEach(() => {
  getWithToken.mockClear();
});

describe('getUser', () => {
  const body = {
    data: 'some data',
  };
  const idUsed = '123456789a8798asd7897d4a';
  const urlRight = `${baseApiURL}/users/${idUsed}`;
  beforeAll(() => {
    getWithToken.mockImplementation(() => Promise.resolve(body));
  });
  beforeEach(() => {
    apiURLs.getUser.mockClear();
  });

  it('called with valid arguments', async () => {
    const data = await api.getUser(idUsed);
    expect(getWithToken).toHaveBeenCalledTimes(1);
    expect(getWithToken).toHaveBeenCalledWith(urlRight);
    expect(apiURLs.getUser).toHaveBeenCalledWith(idUsed);
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid or missing', async () => {
    await expect(api.getUser(null)).rejects.toThrow();
    expect(getWithToken).not.toHaveBeenCalled();
    expect(apiURLs.getUser).not.toHaveBeenCalled();
  });
});

describe('getRatesUser', () => {
  const body = {
    data: 'some data',
  };
  const idUsed = '123456789a8798asd7897d4a';
  const urlRight = `${baseApiURL}/users/${idUsed}/rates?page=0&pageSize=20`;
  beforeAll(() => {
    getWithToken.mockImplementation(() => Promise.resolve(body));
  });

  beforeEach(() => {
    apiURLs.getRatesUser.mockClear();
  });

  it('called with valid arguments, set default 0 if page is missing', async () => {
    const data = await api.getRatesUser({ id: idUsed });
    expect(getWithToken).toHaveBeenCalledTimes(1);
    expect(getWithToken).toHaveBeenCalledWith(urlRight);
    expect(apiURLs.getRatesUser).toHaveBeenCalledWith({ id: idUsed, page: 0 });
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid or missing (page can be omitted)', async () => {
    await expect(api.getRatesUser({ id: true })).rejects.toThrow();
    expect(getWithToken).not.toHaveBeenCalled();
    expect(apiURLs.getRatesUser).not.toHaveBeenCalled();
  });
});

describe('getReviewsUser', () => {
  const body = {
    data: 'some data',
  };
  const idUsed = '123456789a8798asd7897d4a';
  const urlRight = `${baseApiURL}/users/${idUsed}/reviews?page=0&pageSize=20`;
  beforeAll(() => {
    getWithToken.mockImplementation(() => Promise.resolve(body));
  });

  beforeEach(() => {
    apiURLs.getReviewsUser.mockClear();
  });

  it('called with valid arguments, set default 0 if page is missing', async () => {
    const data = await api.getReviewsUser({ id: idUsed });
    expect(getWithToken).toHaveBeenCalledTimes(1);
    expect(getWithToken).toHaveBeenCalledWith(urlRight);
    expect(apiURLs.getReviewsUser).toHaveBeenCalledWith({ id: idUsed, page: 0 });
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid or missing (page can be omitted)', async () => {
    await expect(api.getReviewsUser({ id: 1 })).rejects.toThrow();
    expect(getWithToken).not.toHaveBeenCalled();
    expect(apiURLs.getReviewsUser).not.toHaveBeenCalled();
  });
});

describe('getWatchlistUser', () => {
  const body = {
    data: 'some data',
  };
  const idUsed = '123456789a8798asd7897d4a';
  const urlRight = `${baseApiURL}/users/${idUsed}/watchlist?page=0&pageSize=20`;
  beforeAll(() => {
    getWithToken.mockImplementation(() => Promise.resolve(body));
  });

  beforeEach(() => {
    apiURLs.getWatchlistUser.mockClear();
  });

  it('called with valid arguments, set default 0 if page is missing', async () => {
    const data = await api.getWatchlistUser({ id: idUsed });
    expect(getWithToken).toHaveBeenCalledTimes(1);
    expect(getWithToken).toHaveBeenCalledWith(urlRight);
    expect(apiURLs.getWatchlistUser).toHaveBeenCalledWith({ id: idUsed, page: 0 });
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid or missing (page can be omitted)', async () => {
    await expect(api.getWatchlistUser({ id: false })).rejects.toThrow();
    expect(getWithToken).not.toHaveBeenCalled();
    expect(apiURLs.getWatchlistUser).not.toHaveBeenCalled();
  });
});

describe('getWatchlistUserLight', () => {
  const body = {
    data: 'some data',
  };
  const idUsed = '123456789a8798asd7897d4a';
  const urlRight = `${baseApiURL}/users/${idUsed}/watchlist?light=true`;
  beforeAll(() => {
    getWithToken.mockImplementation(() => Promise.resolve(body));
  });

  beforeEach(() => {
    apiURLs.getWatchlistUserLight.mockClear();
  });

  it('called with valid arguments', async () => {
    const data = await api.getWatchlistUserLight(idUsed);
    expect(getWithToken).toHaveBeenCalledTimes(1);
    expect(getWithToken).toHaveBeenCalledWith(urlRight);
    expect(apiURLs.getWatchlistUserLight).toHaveBeenCalledWith(idUsed);
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid or missing', async () => {
    await expect(api.getWatchlistUserLight(null)).rejects.toThrow();
    expect(getWithToken).not.toHaveBeenCalled();
    expect(apiURLs.getWatchlistUserLight).not.toHaveBeenCalled();
  });
});

describe('getListsUser', () => {
  const body = {
    data: 'some data',
  };
  const idUsed = '123456789a8798asd7897d4a';
  const urlRight = `${baseApiURL}/users/${idUsed}/lists?page=0&pageSize=20`;
  beforeAll(() => {
    getWithToken.mockImplementation(() => Promise.resolve(body));
  });

  beforeEach(() => {
    apiURLs.getListsUser.mockClear();
  });

  it('called with valid arguments, set default 0 if page is missing', async () => {
    const data = await api.getListsUser({ id: idUsed });
    expect(getWithToken).toHaveBeenCalledTimes(1);
    expect(getWithToken).toHaveBeenCalledWith(urlRight);
    expect(apiURLs.getListsUser).toHaveBeenCalledWith({ id: idUsed, page: 0 });
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid or missing (page can be omitted)', async () => {
    await expect(api.getListsUser({ id: null })).rejects.toThrow();
    expect(getWithToken).not.toHaveBeenCalled();
    expect(apiURLs.getListsUser).not.toHaveBeenCalled();
  });
});

describe('getOneListUser', () => {
  const body = {
    data: 'some data',
  };
  const userId = '123456789a8798asd7897d4a';
  const listId = '223456789a8798asd7897a5b';
  const urlRight = `${baseApiURL}/users/${userId}/lists/${listId}?page=0&pageSize=20`;
  beforeAll(() => {
    getWithToken.mockImplementation(() => Promise.resolve(body));
  });

  beforeEach(() => {
    apiURLs.getOneListUser.mockClear();
  });

  it('called with valid arguments, set default 0 if page is missing', async () => {
    const data = await api.getOneListUser({ userId, listId });
    expect(getWithToken).toHaveBeenCalledTimes(1);
    expect(getWithToken).toHaveBeenCalledWith(urlRight);
    expect(apiURLs.getOneListUser).toHaveBeenCalledWith({ userId, listId, page: 0 });
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid or missing (page can be omitted)', async () => {
    await expect(api.getOneListUser({ userId: undefined, listId: NaN })).rejects.toThrow();
    expect(getWithToken).not.toHaveBeenCalled();
    expect(apiURLs.getOneListUser).not.toHaveBeenCalled();
  });
});

describe('getOneListUserLight', () => {
  const body = {
    data: 'some data',
  };
  const userId = '123456789a8798asd7897d4a';
  const listId = '223456789a8798asd7897a5b';
  const urlRight = `${baseApiURL}/users/${userId}/lists/${listId}?light=true`;
  beforeAll(() => {
    getWithToken.mockImplementation(() => Promise.resolve(body));
  });

  beforeEach(() => {
    apiURLs.getOneListUserLight.mockClear();
  });

  it('called with valid arguments', async () => {
    const data = await api.getOneListUserLight({ userId, listId });
    expect(getWithToken).toHaveBeenCalledTimes(1);
    expect(getWithToken).toHaveBeenCalledWith(urlRight);
    expect(apiURLs.getOneListUserLight).toHaveBeenCalledWith({ userId, listId });
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid or missing', async () => {
    await expect(api.getOneListUserLight({ userId: null, listId: NaN })).rejects.toThrow();
    expect(getWithToken).not.toHaveBeenCalled();
    expect(apiURLs.getOneListUserLight).not.toHaveBeenCalled();
  });
});

describe('getMovieDetail', () => {
  const body = {
    data: 'some data',
  };
  const idUsed = '123456789a8798asd7897d4a';
  const urlRight = `${baseApiURL}/movies/${idUsed}/detail`;
  beforeAll(() => {
    getWithToken.mockImplementation(() => Promise.resolve(body));
  });
  beforeEach(() => {
    apiURLs.getMovieDetail.mockClear();
  });

  it('called with valid arguments', async () => {
    const data = await api.getMovieDetail(idUsed);
    expect(getWithToken).toHaveBeenCalledTimes(1);
    expect(getWithToken).toHaveBeenCalledWith(urlRight);
    expect(apiURLs.getMovieDetail).toHaveBeenCalledWith(idUsed);
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid or missing', async () => {
    await expect(api.getMovieDetail(null)).rejects.toThrow();
    expect(getWithToken).not.toHaveBeenCalled();
    expect(apiURLs.getMovieDetail).not.toHaveBeenCalled();
  });
});

describe('getMovieTmdb', () => {
  const body = {
    data: 'some data',
  };
  const idUsed = '123456789a8798asd7897d4a';
  const urlRight = `${baseApiURL}/movies/${idUsed}/tmdb`;
  beforeAll(() => {
    getWithToken.mockImplementation(() => Promise.resolve(body));
  });
  beforeEach(() => {
    apiURLs.getMovieTmdb.mockClear();
  });

  it('called with valid arguments', async () => {
    const data = await api.getMovieTmdb(idUsed);
    expect(getWithToken).toHaveBeenCalledTimes(1);
    expect(getWithToken).toHaveBeenCalledWith(urlRight);
    expect(apiURLs.getMovieTmdb).toHaveBeenCalledWith(idUsed);
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid or missing', async () => {
    await expect(api.getMovieTmdb(null)).rejects.toThrow();
    expect(getWithToken).not.toHaveBeenCalled();
    expect(apiURLs.getMovieTmdb).not.toHaveBeenCalled();
  });
});

describe('getSpecificReviewUser', () => {
  const body = {
    data: 'some data',
  };
  const idUsed = '123456789a8798asd7897d4a';
  const urlRight = `${baseApiURL}/movies/${idUsed}/reviewUser`;
  beforeAll(() => {
    getWithToken.mockImplementation(() => Promise.resolve(body));
  });
  beforeEach(() => {
    apiURLs.getSpecificReviewUser.mockClear();
  });

  it('called with valid arguments', async () => {
    const data = await api.getSpecificReviewUser(idUsed);
    expect(getWithToken).toHaveBeenCalledTimes(1);
    expect(getWithToken).toHaveBeenCalledWith(urlRight);
    expect(apiURLs.getSpecificReviewUser).toHaveBeenCalledWith(idUsed);
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid or missing', async () => {
    await expect(api.getSpecificReviewUser(null)).rejects.toThrow();
    expect(getWithToken).not.toHaveBeenCalled();
    expect(apiURLs.getSpecificReviewUser).not.toHaveBeenCalled();
  });
});

describe('getSpecificRateUser', () => {
  const body = {
    data: 'some data',
  };
  const idUsed = '123456789a8798asd7897d4a';
  const urlRight = `${baseApiURL}/movies/${idUsed}/ratewUser`;
  beforeAll(() => {
    getWithToken.mockImplementation(() => Promise.resolve(body));
  });
  beforeEach(() => {
    apiURLs.getSpecificRateUser.mockClear();
  });

  it('called with valid arguments', async () => {
    const data = await api.getSpecificRateUser(idUsed);
    expect(getWithToken).toHaveBeenCalledTimes(1);
    expect(getWithToken).toHaveBeenCalledWith(urlRight);
    expect(apiURLs.getSpecificRateUser).toHaveBeenCalledWith(idUsed);
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid or missing', async () => {
    await expect(api.getSpecificRateUser(null)).rejects.toThrow();
    expect(getWithToken).not.toHaveBeenCalled();
    expect(apiURLs.getSpecificRateUser).not.toHaveBeenCalled();
  });
});

describe('getReviewsMovie', () => {
  const body = {
    data: 'some data',
  };
  const idUsed = '123456789a8798asd7897d4a';
  const urlRight = `${baseApiURL}/movies/${idUsed}/reviews?page=0&pageSize=20`;
  beforeAll(() => {
    getWithToken.mockImplementation(() => Promise.resolve(body));
  });

  beforeEach(() => {
    apiURLs.getReviewsMovie.mockClear();
  });

  it('called with valid arguments, set default 0 if page is missing', async () => {
    const data = await api.getReviewsMovie({ id: idUsed });
    expect(getWithToken).toHaveBeenCalledTimes(1);
    expect(getWithToken).toHaveBeenCalledWith(urlRight);
    expect(apiURLs.getReviewsMovie).toHaveBeenCalledWith({ id: idUsed, page: 0 });
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid or missing (page can be omitted)', async () => {
    await expect(api.getReviewsMovie({ id: 1 })).rejects.toThrow();
    expect(getWithToken).not.toHaveBeenCalled();
    expect(apiURLs.getReviewsMovie).not.toHaveBeenCalled();
  });
});

describe('getOneReviewMovie', () => {
  const body = {
    data: 'some data',
  };
  const movieId = '123456789a8798asd7897d4a';
  const reviewId = '223456789a8798asd7897a5b';
  const urlRight = `${baseApiURL}/movies/${movieId}/reviews/${reviewId}`;
  beforeAll(() => {
    getWithToken.mockImplementation(() => Promise.resolve(body));
  });

  beforeEach(() => {
    apiURLs.getOneReviewMovie.mockClear();
  });

  it('called with valid arguments', async () => {
    const data = await api.getOneReviewMovie({ movieId, reviewId });
    expect(getWithToken).toHaveBeenCalledTimes(1);
    expect(getWithToken).toHaveBeenCalledWith(urlRight);
    expect(apiURLs.getOneReviewMovie).toHaveBeenCalledWith({ movieId, reviewId });
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid or missing', async () => {
    await expect(api.getOneReviewMovie({ reviewId: null, movieId: true })).rejects.toThrow();
    expect(getWithToken).not.toHaveBeenCalled();
    expect(apiURLs.getOneReviewMovie).not.toHaveBeenCalled();
  });
});

describe('getLatestMovies', () => {
  const body = {
    data: 'some data',
  };

  const urlRight = `${baseApiURL}/movies/latest?page=1`;
  beforeAll(() => {
    getWithToken.mockImplementation(() => Promise.resolve(body));
  });

  beforeEach(() => {
    apiURLs.getLatestMovies.mockClear();
  });

  it('called with valid arguments, set default 1 if page is missing', async () => {
    const data = await api.getLatestMovies();
    expect(getWithToken).toHaveBeenCalledTimes(1);
    expect(getWithToken).toHaveBeenCalledWith(urlRight);
    expect(apiURLs.getLatestMovies).toHaveBeenCalledWith(1);
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid (page can be omitted)', async () => {
    await expect(api.getLatestMovies('one')).rejects.toThrow();
    expect(getWithToken).not.toHaveBeenCalled();
    expect(apiURLs.getLatestMovies).not.toHaveBeenCalled();
  });
});

describe('getPopularMovies', () => {
  const body = {
    data: 'some data',
  };

  const urlRight = `${baseApiURL}/movies/popular?page=1`;
  beforeAll(() => {
    getWithToken.mockImplementation(() => Promise.resolve(body));
  });

  beforeEach(() => {
    apiURLs.getPopularMovies.mockClear();
  });

  it('called with valid arguments, set default 1 if page is missing', async () => {
    const data = await api.getPopularMovies();
    expect(getWithToken).toHaveBeenCalledTimes(1);
    expect(getWithToken).toHaveBeenCalledWith(urlRight);
    expect(apiURLs.getPopularMovies).toHaveBeenCalledWith(1);
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid (page can be omitted)', async () => {
    await expect(api.getPopularMovies('one')).rejects.toThrow();
    expect(getWithToken).not.toHaveBeenCalled();
    expect(apiURLs.getPopularMovies).not.toHaveBeenCalled();
  });
});

describe('getTrendingMovies', () => {
  const body = {
    data: 'some data',
  };

  const urlRight = `${baseApiURL}/movies/trending?page=1`;
  beforeAll(() => {
    getWithToken.mockImplementation(() => Promise.resolve(body));
  });

  beforeEach(() => {
    apiURLs.getTrendingMovies.mockClear();
  });

  it('called with valid arguments, set default 1 if page is missing', async () => {
    const data = await api.getTrendingMovies();
    expect(getWithToken).toHaveBeenCalledTimes(1);
    expect(getWithToken).toHaveBeenCalledWith(urlRight);
    expect(apiURLs.getTrendingMovies).toHaveBeenCalledWith(1);
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid (page can be omitted)', async () => {
    await expect(api.getTrendingMovies('one')).rejects.toThrow();
    expect(getWithToken).not.toHaveBeenCalled();
    expect(apiURLs.getTrendingMovies).not.toHaveBeenCalled();
  });
});

describe('getRatedMovies', () => {
  const body = {
    data: 'some data',
  };

  const urlRight = `${baseApiURL}/movies/rated?page=1`;
  beforeAll(() => {
    getWithToken.mockImplementation(() => Promise.resolve(body));
  });

  beforeEach(() => {
    apiURLs.getRatedMovies.mockClear();
  });

  it('called with valid arguments, set default 1 if page is missing', async () => {
    const data = await api.getRatedMovies();
    expect(getWithToken).toHaveBeenCalledTimes(1);
    expect(getWithToken).toHaveBeenCalledWith(urlRight);
    expect(apiURLs.getRatedMovies).toHaveBeenCalledWith(1);
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid (page can be omitted)', async () => {
    await expect(api.getRatedMovies('one')).rejects.toThrow();
    expect(getWithToken).not.toHaveBeenCalled();
    expect(apiURLs.getRatedMovies).not.toHaveBeenCalled();
  });
});

describe('getMoviesByGenre', () => {
  const body = {
    data: 'some data',
  };

  const genres = '28, 27';
  const urlRight = `${baseApiURL}/movies/genre?genres=${genres}&page=1`;
  beforeAll(() => {
    getWithToken.mockImplementation(() => Promise.resolve(body));
  });

  beforeEach(() => {
    apiURLs.getMoviesByGenre.mockClear();
  });

  it('called with valid arguments, set default 1 if page is missing', async () => {
    const data = await api.getMoviesByGenre({ genres });
    expect(getWithToken).toHaveBeenCalledTimes(1);
    expect(getWithToken).toHaveBeenCalledWith(urlRight);
    expect(apiURLs.getMoviesByGenre).toHaveBeenCalledWith({ genres, page: 1 });
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid or missing (page can be omitted)', async () => {
    await expect(api.getMoviesByGenre({ genres: null })).rejects.toThrow();
    expect(getWithToken).not.toHaveBeenCalled();
    expect(apiURLs.getMoviesByGenre).not.toHaveBeenCalled();
  });
});

describe('getMoviesBySearch', () => {
  const body = {
    data: 'some data',
  };

  const query = 'The Fast and the Furious';
  const urlRight = `${baseApiURL}/movies/search?query=${encodeURIComponent(query)}&page=1`;
  beforeAll(() => {
    getWithToken.mockImplementation(() => Promise.resolve(body));
  });

  beforeEach(() => {
    apiURLs.getMoviesBySearch.mockClear();
  });

  it('called with valid arguments, set default 1 if page is missing', async () => {
    const data = await api.getMoviesBySearch({ query });
    expect(getWithToken).toHaveBeenCalledTimes(1);
    expect(getWithToken).toHaveBeenCalledWith(urlRight);
    expect(apiURLs.getMoviesBySearch).toHaveBeenCalledWith({ query, page: 1 });
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid (page and query can be omitted, query set by default as a empty string)', async () => {
    await expect(api.getMoviesBySearch({ query: null })).rejects.toThrow();
    expect(getWithToken).not.toHaveBeenCalled();
    expect(apiURLs.getMoviesBySearch).not.toHaveBeenCalled();
  });
});
