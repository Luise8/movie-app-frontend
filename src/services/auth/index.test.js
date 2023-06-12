import * as api from 'src/services/auth/';
import { postWithToken, getWithToken } from 'src/services/fetch-with-token-methods';
import { apiURLs, baseApiURL } from 'src/services/settings';

// mock apiURLs
jest.mock('src/services/settings');

// mock fetch-with-token-methods
jest.mock('src/services/fetch-with-token-methods', () => ({
  postWithToken: jest.fn(),
  getWithToken: jest.fn(),
}));

beforeEach(() => {
  postWithToken.mockClear();
  getWithToken.mockClear();
});

describe('logIn', () => {
  const body = {
    username: 'userNumber0',
    password: 'userNumber0',
  };
  const userId = '123456789a8798asd7897d4a';
  const sessionStatus = { currentSession: { isAuth: true, userId } };
  const urlRight = `${baseApiURL}/auth/login`;

  beforeAll(() => {
    postWithToken.mockImplementation(() => Promise.resolve(sessionStatus));
  });

  it('called with valid arguments', async () => {
    const data = await api.logIn({ ...body });
    expect(postWithToken).toHaveBeenCalledTimes(1);
    expect(postWithToken).toHaveBeenCalledWith({ url: urlRight, body });
    expect(apiURLs.authLogIn).toBe(urlRight);
    expect(data).toBe(sessionStatus);
  });

  it('rejecting with error if some argument is invalid or missing', async () => {
    await expect(api.logIn({ username: 1, password: false })).rejects.toThrow();
    expect(postWithToken).not.toHaveBeenCalled();
  });
});

describe('satausAuth', () => {
  const userId = '123456789a8798asd7897d4a';
  const sessionStatus = { currentSession: { isAuth: true, userId } };
  const urlRight = `${baseApiURL}/auth/status`;

  beforeAll(() => {
    getWithToken.mockImplementation(() => Promise.resolve(sessionStatus));
  });

  it('successful with return of status of current session', async () => {
    const data = await api.authStatus();
    expect(getWithToken).toHaveBeenCalledTimes(1);
    expect(getWithToken).toHaveBeenCalledWith(urlRight);
    expect(apiURLs.authStatus).toBe(urlRight);
    expect(data).toBe(sessionStatus);
  });
});

describe('logOut', () => {
  const sessionStatus = { currentSession: { isAuth: false, userId: null } };
  const urlRight = `${baseApiURL}/auth/logout`;

  beforeAll(() => {
    postWithToken.mockImplementation(() => Promise.resolve(sessionStatus));
  });

  it('successful with return of session close', async () => {
    const data = await api.logOut();
    expect(postWithToken).toHaveBeenCalledTimes(1);
    expect(postWithToken).toHaveBeenCalledWith({ url: urlRight });
    expect(apiURLs.authLogoOut).toBe(urlRight);
    expect(data).toBe(sessionStatus);
  });
});
