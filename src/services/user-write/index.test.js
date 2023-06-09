import * as api from './index';
import { postWithToken, deleteWithToken, putWithToken } from '../fetch-with-token-methods';
import { apiURLs, baseApiURL } from '../settings';

// mock apiURLs
jest.mock('../settings');

// mock getWithToken
jest.mock('../fetch-with-token-methods', () => ({
  postWithToken: jest.fn(),
  deleteWithToken: jest.fn(),
  putWithToken: jest.fn(),
}));

beforeEach(() => {
  postWithToken.mockClear();
  putWithToken.mockClear();
  deleteWithToken.mockClear();
});

describe('createUser', () => {
  const body = {
    username: 'username1',
    password: 'username1',

  };
  const urlRight = `${baseApiURL}/users`;
  beforeAll(() => {
    postWithToken.mockImplementation(() => Promise.resolve(body));
  });

  it('called with valid arguments', async () => {
    const data = await api.createUser(body);
    expect(postWithToken).toHaveBeenCalledTimes(1);
    expect(postWithToken).toHaveBeenCalledWith({ url: urlRight, body });
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid or missing', async () => {
    await expect(api.createUser({ username: 1, password: false })).rejects.toThrow();
    expect(postWithToken).not.toHaveBeenCalled();
  });
});

describe('editUser', () => {
  const body = {
    username: 'usernameChanged',
    password: 'username1',

  };
  const idUsed = '123456789a8798asd7897d4a';
  const urlRight = `${baseApiURL}/users/${idUsed}`;
  beforeAll(() => {
    putWithToken.mockImplementation(() => Promise.resolve(body));
  });
  beforeEach(() => {
    apiURLs.editUser.mockClear();
  });

  it('called with valid arguments', async () => {
    const data = await api.editUser({ ...body, id: idUsed });
    expect(putWithToken).toHaveBeenCalledTimes(1);
    expect(putWithToken).toHaveBeenCalledWith({ url: urlRight, body });
    expect(apiURLs.editUser).toHaveBeenCalledWith(idUsed);
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid or missing', async () => {
    await expect(api.editUser({ username: 1, password: false })).rejects.toThrow();
    expect(putWithToken).not.toHaveBeenCalled();
  });
});

describe('deleteUser', () => {
  const response = {
    ok: true,
    status: 204,
  };
  const idUsed = '123456789a8798asd7897d4a';
  const urlRight = `${baseApiURL}/users/${idUsed}`;

  beforeAll(() => {
    deleteWithToken.mockImplementation(() => Promise.resolve(response));
  });
  beforeEach(() => {
    apiURLs.deleteUser.mockClear();
  });

  it('called with valid arguments', async () => {
    const data = await api.deleteUser(idUsed);
    expect(deleteWithToken).toHaveBeenCalledTimes(1);
    expect(deleteWithToken).toHaveBeenCalledWith(urlRight);
    expect(apiURLs.deleteUser).toHaveBeenCalledWith(idUsed);
    expect(data).toBe(response);
  });

  it('rejecting with error if some argument is invalid or missing', async () => {
    await expect(api.deleteUser(null)).rejects.toThrow();
    expect(deleteWithToken).not.toHaveBeenCalled();
    expect(apiURLs.deleteUser).not.toHaveBeenCalled();
  });
});
