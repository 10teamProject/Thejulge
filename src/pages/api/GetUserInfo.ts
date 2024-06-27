import { instance } from './AxiosInstance';

interface SessionUserInfo {
  id: string;
  email: string;
  type: string;
}

interface UserApiResponse {
  item: {
    id: string;
    email: string;
    type: string;
    shop?: {
      item: {
        id: string;
      };
    };
  };
}

export const GetUserInfo = async (): Promise<
  UserApiResponse['item'] | null
> => {
  const userString = sessionStorage.getItem('user');

  if (!userString) {
    return null;
  }

  try {
    const sessionUser: SessionUserInfo = JSON.parse(userString);
    const response = await instance.get<UserApiResponse>(
      `/users/${sessionUser.id}`,
    );
    return response.data.item;
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
};
