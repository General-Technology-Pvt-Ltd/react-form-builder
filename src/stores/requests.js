import fetch from 'isomorphic-fetch';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
  OPTIONS: '',
};

export function post(url, data) {
  return fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  }).then(response => response);
}

export function get(url, accessToken = null) {
  if(accessToken) {
    headers['Authorization'] = 'Bearer ' + accessToken
  }
  return fetch(url, {
    method: 'GET',
    headers,
  }).then(response => response.json());
}
