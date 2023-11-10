import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';
import 'regenerator-runtime/runtime';

const timeout = function (s) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(`Request took too long.Request timeout after ${s} seconds`)
      );
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message}, ${data.response}`);

    return data;
  } catch (err) {
    throw err;
  }
};

export const deleteJSON = async function (url) {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete resource'); 
    }
  } catch (error) {
    throw error;
  }
};