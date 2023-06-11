import {
  getWithToken, postWithToken, deleteWithToken, putWithToken,
} from './index';

jest.mock('../settings', () => ({
  recaptchaKey: '123',
}));

// mock fetch
global.fetch = jest.fn();

const recaptchaToken = '123';
// mock google recaptcha functions
global.grecaptcha = {
  ready: jest.fn((callback) => callback()),
  execute: jest.fn(() => Promise.resolve(recaptchaToken)),
};

const url = 'url';
const initialtOtions = {
  credentials: 'include',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    recaptcha: recaptchaToken,
  },
};
function generateOptions({ method, body }) {
  return { ...initialtOtions, method, body };
}
beforeEach(() => {
  fetch.mockClear();
  global.grecaptcha.ready.mockClear();
  global.grecaptcha.execute.mockClear();
});

describe('get', () => {
  const body = {
    data: 'some data',
  };
  beforeAll(() => {
    fetch.mockImplementation(() => Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(body),
    }));
  });

  it('called with valid arguments', async () => {
    const data = await getWithToken(url);
    expect(global.grecaptcha.ready).toHaveBeenCalledTimes(1);
    expect(global.grecaptcha.execute).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(url, generateOptions({ method: 'GET' }));
    expect(data).toBe(body);
  });

  it('rejecting with the error when the exectue method get some error and don\'t call fetch function', async () => {
    global.grecaptcha.execute.mockImplementationOnce(() => Promise.reject(new Error('error')));
    await expect(getWithToken(url)).rejects.toThrow('error');
    expect(global.grecaptcha.ready).toHaveBeenCalledTimes(1);
    expect(global.grecaptcha.execute).toHaveBeenCalledTimes(1);
    expect(fetch).not.toBeCalled();
  });

  it('rejecting with the error when fetch throw some expection', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('error')));
    await expect(getWithToken(url)).rejects.toThrow('error');
    expect(global.grecaptcha.ready).toHaveBeenCalledTimes(1);
    expect(global.grecaptcha.execute).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe('post', () => {
  const body = {
    data: 'some data',
  };
  const method = 'POST';
  beforeAll(() => {
    fetch.mockImplementation(() => Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(body),
    }));
  });

  it('called with valid arguments', async () => {
    const data = await postWithToken({ url, body });
    expect(global.grecaptcha.ready).toHaveBeenCalledTimes(1);
    expect(global.grecaptcha.execute).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch)
      .toHaveBeenCalledWith(url, generateOptions({ method, body: JSON.stringify(body) }));
    expect(data).toBe(body);
  });

  it('fails rejecting with the error when the exectue method get some error and don\'t call fetch function', async () => {
    global.grecaptcha.execute.mockImplementationOnce(() => Promise.reject(new Error('error')));
    await expect(postWithToken({ url, body })).rejects.toThrow('error');
    expect(global.grecaptcha.ready).toHaveBeenCalledTimes(1);
    expect(global.grecaptcha.execute).toHaveBeenCalledTimes(1);
    expect(fetch).not.toBeCalled();
  });

  it('rejecting with the error when fetch throw some expection', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('error')));
    await expect(postWithToken({ url, body })).rejects.toThrow('error');
    expect(global.grecaptcha.ready).toHaveBeenCalledTimes(1);
    expect(global.grecaptcha.execute).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe('put', () => {
  const body = {
    data: 'some data',
  };
  const method = 'PUT';
  beforeAll(() => {
    fetch.mockImplementation(() => Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(body),
    }));
  });

  it('called with valid arguments, multiplart set to false by default', async () => {
    const data = await putWithToken({ url, body });
    expect(global.grecaptcha.ready).toHaveBeenCalledTimes(1);
    expect(global.grecaptcha.execute).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch)
      .toHaveBeenCalledWith(url, generateOptions({ method, body: JSON.stringify(body) }));
    expect(data).toBe(body);
  });

  it('called with valid arguments and multipart true, set the correct header and body', async () => {
    const data = await putWithToken({ url, body, multipart: true });
    expect(global.grecaptcha.ready).toHaveBeenCalledTimes(1);
    expect(global.grecaptcha.execute).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch)
      .toHaveBeenCalledWith(url, {
        method: 'PUT',
        credentials: 'include',
        headers: { recaptcha: recaptchaToken },
        body,
      });
    expect(data).toBe(body);
  });

  it('fails rejecting with the error when the exectue method get some error and don\'t call fetch function', async () => {
    global.grecaptcha.execute.mockImplementationOnce(() => Promise.reject(new Error('error')));
    await expect(putWithToken({ url, body })).rejects.toThrow('error');
    expect(global.grecaptcha.ready).toHaveBeenCalledTimes(1);
    expect(global.grecaptcha.execute).toHaveBeenCalledTimes(1);
    expect(fetch).not.toBeCalled();
  });

  it('rejecting with the error when fetch throw some expection', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('error')));
    await expect(putWithToken({ url, body })).rejects.toThrow('error');
    expect(global.grecaptcha.ready).toHaveBeenCalledTimes(1);
    expect(global.grecaptcha.execute).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});

describe('delete', () => {
  const method = 'DELETE';
  beforeAll(() => {
    fetch.mockImplementation(() => Promise.resolve({
      ok: true,
      status: 204,
    }));
  });

  it('called with valid arguments', async () => {
    const response = await deleteWithToken(url);
    expect(global.grecaptcha.ready).toHaveBeenCalledTimes(1);
    expect(global.grecaptcha.execute).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(url, generateOptions({ method }));
    expect(response.status).toBe(204);
  });

  it('rejecting with the error when the exectue method get some error and don\'t call fetch function', async () => {
    global.grecaptcha.execute.mockImplementationOnce(() => Promise.reject(new Error('error')));
    await expect(deleteWithToken(url)).rejects.toThrow('error');
    expect(global.grecaptcha.ready).toHaveBeenCalledTimes(1);
    expect(global.grecaptcha.execute).toHaveBeenCalledTimes(1);
    expect(fetch).not.toBeCalled();
  });

  it('rejecting with the error when fetch throw some expection', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('error')));
    await expect(deleteWithToken(url)).rejects.toThrow('error');
    expect(global.grecaptcha.ready).toHaveBeenCalledTimes(1);
    expect(global.grecaptcha.execute).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
