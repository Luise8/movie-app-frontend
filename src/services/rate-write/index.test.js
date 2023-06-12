import * as api from 'src/services/rate-write/';
import { postWithToken, deleteWithToken, putWithToken } from 'src/services/fetch-with-token-methods';
import { apiURLs, baseApiURL } from 'src/services/settings';

// mock apiURLs
jest.mock('src/services/settings');

// mock fetch-with-token-methods
jest.mock('src/services/fetch-with-token-methods', () => ({
  postWithToken: jest.fn(),
  deleteWithToken: jest.fn(),
  putWithToken: jest.fn(),
}));

beforeEach(() => {
  postWithToken.mockClear();
  putWithToken.mockClear();
  deleteWithToken.mockClear();
});

describe('createRate', () => {
  const body = {
    value: 6,
  };
  const idUsed = '123456789a8798asd7897d4a';
  const urlRight = `${baseApiURL}/movies/${idUsed}/rates`;

  beforeAll(() => {
    postWithToken.mockImplementation(() => Promise.resolve(body));
  });
  beforeEach(() => {
    apiURLs.createRate.mockClear();
  });

  it('called with valid arguments', async () => {
    const data = await api.createRate({ ...body, id: idUsed });
    expect(postWithToken).toHaveBeenCalledTimes(1);
    expect(postWithToken).toHaveBeenCalledWith({ url: urlRight, body });
    expect(apiURLs.createRate).toHaveBeenCalledWith(idUsed);
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid or missing', async () => {
    await expect(api.createRate({ value: 1, body: false })).rejects.toThrow();
    expect(postWithToken).not.toHaveBeenCalled();
  });
});

describe('editRate', () => {
  const body = {
    value: 6,
  };
  const movieId = '123456789a8798asd7897d4a';
  const rateId = '223456789a8798asd7897a5b';
  const urlRight = `${baseApiURL}/movies/${movieId}/rates/${rateId}`;
  beforeAll(() => {
    putWithToken.mockImplementation(() => Promise.resolve(body));
  });
  beforeEach(() => {
    apiURLs.editRate.mockClear();
  });

  it('called with valid arguments', async () => {
    const data = await api.editRate({ ...body, movieId, rateId });
    expect(putWithToken).toHaveBeenCalledTimes(1);
    expect(putWithToken).toHaveBeenCalledWith({ url: urlRight, body });
    expect(apiURLs.editRate).toHaveBeenCalledWith({ movieId, rateId });
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid or missing', async () => {
    await expect(api.editRate({ value: 1, body: false })).rejects.toThrow();
    expect(putWithToken).not.toHaveBeenCalled();
  });
});

describe('deleteRate', () => {
  const response = {
    ok: true,
    status: 204,
  };
  const movieId = '123456789a8798asd7897d4a';
  const rateId = '223456789a8798asd7897a5b';
  const urlRight = `${baseApiURL}/movies/${movieId}/rates/${rateId}`;

  beforeAll(() => {
    deleteWithToken.mockImplementation(() => Promise.resolve(response));
  });
  beforeEach(() => {
    apiURLs.deleteRate.mockClear();
  });

  it('called with valid arguments', async () => {
    const data = await api.deleteRate({ movieId, rateId });
    expect(deleteWithToken).toHaveBeenCalledTimes(1);
    expect(deleteWithToken).toHaveBeenCalledWith(urlRight);
    expect(apiURLs.deleteRate).toHaveBeenCalledWith({ movieId, rateId });
    expect(data).toBe(response);
  });

  it('rejecting with error if some argument is invalid or missing', async () => {
    await expect(api.deleteRate({ movieId: null, rateId: true })).rejects.toThrow();
    expect(deleteWithToken).not.toHaveBeenCalled();
    expect(apiURLs.deleteRate).not.toHaveBeenCalled();
  });
});
