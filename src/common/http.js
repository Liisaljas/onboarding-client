function transformResponse(response) {
  if (response.ok && response.status < 400) {
    return response.json();
  } else if (response.status >= 400) {
    return response
      .json()
      .then((data) => {
        const error = {};
        error.status = response.status;
        error.body = data;
        throw error;
      });
  }
  throw response;
}

function transformFileResponse(response) {
  if (response.ok && response.status < 400) {
    return response.blob();
  }
  throw response;
}

function urlEncodeParameters(params) {
  return Object
    .keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
}

export function get(url, params = {}, headers = {}) {
  const urlParameters = urlEncodeParameters(params);
  return fetch(`${url}${urlParameters ? `?${urlParameters}` : ''}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
  }).then(transformResponse);
}

export function downloadFile(url, headers = {}) {
  return fetch(url, {
    headers,
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    cache: 'default',
  }).then(transformFileResponse);
}

export function post(url, params = {}, headers = {}) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(params),
    credentials: 'include',
    mode: 'cors',
    cache: 'default',
  }).then(transformResponse);
}

// TODO: write tests for this
export function put(url, params = {}, headers = {}) {
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(params),
    credentials: 'include',
    mode: 'cors',
    cache: 'default',
  }).then(transformResponse);
}

export function postForm(url, params = {}, headers = {}) {
  const body = urlEncodeParameters(params);
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...headers,
    },
    body,
    credentials: 'include',
    mode: 'cors',
    cache: 'default',
  }).then(transformResponse);
}
