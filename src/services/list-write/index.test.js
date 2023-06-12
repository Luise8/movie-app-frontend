import * as api from 'src/services/list-write/';
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

describe('createList', () => {
  const body = {
    name: 'New list created',
    description: 'New list description',
  };
  const idUsed = '123456789a8798asd7897d4a';
  const urlRight = `${baseApiURL}/users/${idUsed}/lists`;

  beforeAll(() => {
    postWithToken.mockImplementation(() => Promise.resolve(body));
  });
  beforeEach(() => {
    apiURLs.createList.mockClear();
  });

  it('called with valid arguments', async () => {
    const data = await api.createList({ ...body, id: idUsed });
    expect(postWithToken).toHaveBeenCalledTimes(1);
    expect(postWithToken).toHaveBeenCalledWith({ url: urlRight, body });
    expect(apiURLs.createList).toHaveBeenCalledWith(idUsed);
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid or missing', async () => {
    await expect(api.createList({ name: 1, description: false })).rejects.toThrow();
    expect(postWithToken).not.toHaveBeenCalled();
  });
});

describe('editList', () => {
  const body = {
    name: 'List name updated',
    description: 'List description updated',
    movies: ['9799'],
  };
  const userId = '123456789a8798asd7897d4a';
  const listId = '223456789a8798asd7897a5b';
  const urlRight = `${baseApiURL}/users/${userId}/lists/${listId}`;
  beforeAll(() => {
    putWithToken.mockImplementation(() => Promise.resolve(body));
  });
  beforeEach(() => {
    apiURLs.editList.mockClear();
  });

  it('called with valid arguments', async () => {
    const data = await api.editList({ ...body, userId, listId });
    expect(putWithToken).toHaveBeenCalledTimes(1);
    expect(putWithToken).toHaveBeenCalledWith({ url: urlRight, body });
    expect(apiURLs.editList).toHaveBeenCalledWith({ userId, listId });
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid or missing (name, description, movies can be omitted)', async () => {
    await expect(api.editList({ name: 1, description: false, movies: {} })).rejects.toThrow();
    expect(putWithToken).not.toHaveBeenCalled();
  });
});

describe('deleteList', () => {
  const response = {
    ok: true,
    status: 204,
  };
  const userId = '123456789a8798asd7897d4a';
  const listId = '223456789a8798asd7897a5b';
  const urlRight = `${baseApiURL}/users/${userId}/lists/${listId}`;

  beforeAll(() => {
    deleteWithToken.mockImplementation(() => Promise.resolve(response));
  });
  beforeEach(() => {
    apiURLs.deleteList.mockClear();
  });

  it('called with valid arguments', async () => {
    const data = await api.deleteList({ userId, listId });
    expect(deleteWithToken).toHaveBeenCalledTimes(1);
    expect(deleteWithToken).toHaveBeenCalledWith(urlRight);
    expect(apiURLs.deleteList).toHaveBeenCalledWith({ userId, listId });
    expect(data).toBe(response);
  });

  it('rejecting with error if some argument is invalid or missing', async () => {
    await expect(api.deleteList({ userId: null, listId: true })).rejects.toThrow();
    expect(deleteWithToken).not.toHaveBeenCalled();
    expect(apiURLs.deleteList).not.toHaveBeenCalled();
  });
});
