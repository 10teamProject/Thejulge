import axios, { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface UpdateUserRequestBody {
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

interface Link {
  href: string;
  rel: string;
}

interface UpdateUserResponse {
  item: {
    id: string;
    email: string;
    type: 'employer' | 'employee';
    name?: string;
    phone?: string;
    address?: string;
    bio?: string;
    shop: {
      item: {
        id: string;
        name: string;
        category: string;
        address1: string;
        address2: string;
        description: string;
        imageUrl: string;
        originalHourlyPay: number;
      };
    } | null;
  };
  links: Link[];
}

interface ErrorResponse {
  message: string;
}

export async function updateUserProfile(userId: string, userProfile: UpdateUserRequestBody): Promise<UpdateUserResponse | ErrorResponse> {
  const token = Cookies.get('token');
  if (!token) {
    throw new Error('토큰이 없습니다.');
  }

  try {
    const response: AxiosResponse<UpdateUserResponse> = await axios.put(`${apiUrl}/users/${userId}`, userProfile, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError<ErrorResponse> = error;
      if (axiosError.response) {
        throw axiosError.response.data; // 에러 응답 처리
      } else if (axiosError.request) {
        throw { message: '서버로의 요청 실패' }; // 요청 전송 실패 처리
      } else {
        throw { message: '네트워크 오류' }; // 요청 전송 중 네트워크 오류 처리
      }
    } else {
      throw { message: 'Axios 오류' }; // AxiosError가 아닐 때
    }
  }
}