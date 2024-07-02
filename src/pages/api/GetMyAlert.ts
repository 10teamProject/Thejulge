import Cookies from 'js-cookie';

import { AlertResponse } from '@/types/notificationType';

import { instance } from './AxiosInstance';

export const getUserAlerts = async (
  offset?: number,
  limit?: number,
): Promise<AlertResponse> => {
  try {
    const userString = sessionStorage.getItem('user');
    if (!userString) {
      throw new Error('유저 정보가 없습니다.');
    }

    const user = JSON.parse(userString);
    if (!user.id) {
      throw new Error('유저 아이디가 없습니다.');
    }

    const response = await instance.get(`/users/${user.id}/alerts`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      params: {
        offset,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user alerts:', error);
    throw error;
  }
};

export const readAlert = async (alert_id: string) => {
  try {
    const userString = sessionStorage.getItem('user');
    if (!userString) {
      throw new Error('유저 정보가 없습니다.');
    }

    const user = JSON.parse(userString);
    if (!user.id) {
      throw new Error('유저 아이디가 없습니다.');
    }

    const response = await instance.put(
      `/users/${user.id}/alerts/${alert_id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error reading alert:', error);
    throw error;
  }
};
