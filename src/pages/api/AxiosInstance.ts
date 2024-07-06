import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

export const instance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
   'Content-Type': 'application/json',
  },
});

function fetchAPI() {
  const token = Cookies.get('token');

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    },
  });
};

export default fetchAPI;