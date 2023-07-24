// FETCH METHODS WITHOUT RECAPTCHA TOKEN //
/* These methods can be used instead of the with token
 methods when recapcha verification is not required. To do
 this, just change the calls on the auth, get - data, and write* folders */

// GET
export async function getWithoutToken(url) {
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }

  // To get error message when there is any
  if (/application\/json/i.test(response.headers.get('content-type'))) {
    const error = await response.json();
    error.status = response.status;
    throw error;
  }

  const error = new Error(response);
  error.status = response.status;
  error.message = response.statusText;
  throw error;
}

// POST
export async function postWithoutToken({ url, body }) {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }

  // To get error message when there is any
  if (/application\/json/i.test(response.headers.get('content-type'))) {
    const error = await response.json();
    error.status = response.status;
    throw error;
  }

  const error = new Error(response);
  error.status = response.status;
  error.message = response.statusText;
  throw error;
}

// DELETE
export async function deleteWithoutToken(url) {
  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    return response;
  }

  // To get error message when there is any
  if (/application\/json/i.test(response.headers.get('content-type'))) {
    const error = await response.json();
    error.status = response.status;
    throw error;
  }

  const error = new Error(response);
  error.status = response.status;
  error.message = response.statusText;
  throw error;
}

// PUT
export async function putWithoutToken({ url, body, multipart = false } = {}) {
  let response;
  if (multipart) {
    response = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: {

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

      },
      body: JSON.stringify(body),
    });
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }

  // To get error message when there is any
  if (/application\/json/i.test(response.headers.get('content-type'))) {
    const error = await response.json();
    error.status = response.status;
    throw error;
  }

  const error = new Error(response);
  error.status = response.status;
  error.message = response.statusText;
  throw error;
}
