import * as api from './index';
import { postWithToken, deleteWithToken, putWithToken } from '../fetch-with-token-methods';
import { apiURLs, baseApiURL } from '../settings';

// mock apiURLs
jest.mock('../settings');

// mock fetch-with-token-methods
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

describe('createReview', () => {
  const body = {
    title: 'New review created now',
    body: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam labore eaque sapiente. Dignissimos, labore repellat! Totam voluptas officiis laborum aut! Tempora doloribus a, laudantium reiciendis eaque atque ipsa quaerat iusto.
    Ea sequi quae, repellendus accusamus, pariatur, praesentium blanditiis molestiae officiis nulla animi rerum.Perferendis aut similique fugiat repudiandae obcaecati, at consectetur, fuga commodi modi quis reprehenderit excepturi suscipit deleniti alias.
    Error molestiae nesciunt facilis libero quam nobis rem rerum qui? Fugiat error, laboriosam sequi corporis asperiores totam ut cum consectetur cumque at quidem, reiciendis molestias, dignissimos saepe? Nulla, explicabo nam`,
  };
  const idUsed = '123456789a8798asd7897d4a';
  const urlRight = `${baseApiURL}/movies/${idUsed}/reviews`;

  beforeAll(() => {
    postWithToken.mockImplementation(() => Promise.resolve(body));
  });
  beforeEach(() => {
    apiURLs.createReview.mockClear();
  });

  it('called with valid arguments', async () => {
    const data = await api.createReview({ ...body, id: idUsed });
    expect(postWithToken).toHaveBeenCalledTimes(1);
    expect(postWithToken).toHaveBeenCalledWith({ url: urlRight, body });
    expect(apiURLs.createReview).toHaveBeenCalledWith(idUsed);
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid or missing', async () => {
    await expect(api.createReview({ title: 1, body: false })).rejects.toThrow();
    expect(postWithToken).not.toHaveBeenCalled();
  });
});

describe('editReview', () => {
  const body = {
    title: 'New review created now',
    body: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam labore eaque sapiente. Dignissimos, labore repellat! Totam voluptas officiis laborum aut! Tempora doloribus a, laudantium reiciendis eaque atque ipsa quaerat iusto.
    Ea sequi quae, repellendus accusamus, pariatur, praesentium blanditiis molestiae officiis nulla animi rerum.Perferendis aut similique fugiat repudiandae obcaecati, at consectetur, fuga commodi modi quis reprehenderit excepturi suscipit deleniti alias.
    Error molestiae nesciunt facilis libero quam nobis rem rerum qui? Fugiat error, laboriosam sequi corporis asperiores totam ut cum consectetur cumque at quidem, reiciendis molestias, dignissimos saepe? Nulla, explicabo nam`,
  };
  const movieId = '123456789a8798asd7897d4a';
  const reviewId = '223456789a8798asd7897a5b';
  const urlRight = `${baseApiURL}/movies/${movieId}/reviews/${reviewId}`;
  beforeAll(() => {
    putWithToken.mockImplementation(() => Promise.resolve(body));
  });
  beforeEach(() => {
    apiURLs.editReview.mockClear();
  });

  it('called with valid arguments', async () => {
    const data = await api.editReview({ ...body, movieId, reviewId });
    expect(putWithToken).toHaveBeenCalledTimes(1);
    expect(putWithToken).toHaveBeenCalledWith({ url: urlRight, body });
    expect(apiURLs.editReview).toHaveBeenCalledWith({ movieId, reviewId });
    expect(data).toBe(body);
  });

  it('rejecting with error if some argument is invalid or missing', async () => {
    await expect(api.editReview({ title: 1, body: false })).rejects.toThrow();
    expect(putWithToken).not.toHaveBeenCalled();
  });
});

describe('deleteReview', () => {
  const response = {
    ok: true,
    status: 204,
  };
  const movieId = '123456789a8798asd7897d4a';
  const reviewId = '223456789a8798asd7897a5b';
  const urlRight = `${baseApiURL}/movies/${movieId}/reviews/${reviewId}`;

  beforeAll(() => {
    deleteWithToken.mockImplementation(() => Promise.resolve(response));
  });
  beforeEach(() => {
    apiURLs.deleteReview.mockClear();
  });

  it('called with valid arguments', async () => {
    const data = await api.deleteReview({ movieId, reviewId });
    expect(deleteWithToken).toHaveBeenCalledTimes(1);
    expect(deleteWithToken).toHaveBeenCalledWith(urlRight);
    expect(apiURLs.deleteReview).toHaveBeenCalledWith({ movieId, reviewId });
    expect(data).toBe(response);
  });

  it('rejecting with error if some argument is invalid or missing', async () => {
    await expect(api.deleteReview({ movieId: null, reviewId: true })).rejects.toThrow();
    expect(deleteWithToken).not.toHaveBeenCalled();
    expect(apiURLs.deleteReview).not.toHaveBeenCalled();
  });
});
