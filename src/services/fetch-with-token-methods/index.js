import { recaptchaKey } from '../settings';

// FETCH METHODS WITH RECAPTCHA TOKEN //

// GET
export async function getWithToken(url) {
  const token = await new Promise((resolve, reject) => {
    window.grecaptcha.ready(async () => {
      try {
        const newToken = await window.grecaptcha.execute(recaptchaKey, { action: 'submit' });

        resolve(newToken);
      } catch (error) {
        reject(new Error(error));
      }
    });
  });

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      recaptcha: token,
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }
  const error = new Error(response);
  error.status = response.status;
  error.message = response.statusText;
  throw error;
}

// POST
export async function postWithToken({ url, body }) {
  const token = await new Promise((resolve, reject) => {
    window.grecaptcha.ready(async () => {
      try {
        const newToken = await window.grecaptcha.execute(recaptchaKey, { action: 'submit' });

        resolve(newToken);
      } catch (error) {
        reject(new Error(error));
      }
    });
  });
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      recaptcha: token,
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }
  const error = new Error(response);
  error.status = response.status;
  error.message = response.statusText;
  throw error;
}

// DELETE
export async function deleteWithToken(url) {
  const token = await new Promise((resolve, reject) => {
    window.grecaptcha.ready(async () => {
      try {
        const newToken = await window.grecaptcha.execute(recaptchaKey, { action: 'submit' });

        resolve(newToken);
      } catch (error) {
        reject(new Error(error));
      }
    });
  });

  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      recaptcha: token,
    },
  });

  if (response.ok) {
    return response;
  }
  const error = new Error(response);
  error.status = response.status;
  error.message = response.statusText;
  throw error;
}

// PUT
export async function putWithToken({ url, body, multipart = false } = {}) {
  const token = await new Promise((resolve, reject) => {
    window.grecaptcha.ready(async () => {
      try {
        const newToken = await window.grecaptcha.execute(recaptchaKey, { action: 'submit' });

        resolve(newToken);
      } catch (error) {
        reject(new Error(error));
      }
    });
  });
  let response;
  if (multipart) {
    response = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        recaptcha: token,
      },
      body,
    });
  } else {
    response = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        recaptcha: token,
      },
      body: JSON.stringify(body),
    });
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
  const error = new Error(response);
  error.status = response.status;
  error.message = response.statusText;
  throw error;
}
