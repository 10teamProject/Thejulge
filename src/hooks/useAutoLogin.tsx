import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

import { useAuth } from '@/contexts/AuthProvider';
import { LoginUser } from '@/pages/api/LoginUser';

interface AutoLoginResult {
  success: boolean;
  message: string;
}

export const useAutoLogin = () => {
  const router = useRouter();
  const { setUser, setToken } = useAuth();

  const autoLogin = async (
    email: string,
    password: string,
  ): Promise<AutoLoginResult> => {
    try {
      const loginResponse = await LoginUser({ email, password });
      if (loginResponse && loginResponse.item && loginResponse.item.token) {
        Cookies.set('token', loginResponse.item.token, { expires: 7 });
        setToken(loginResponse.item.token);
        setUser(loginResponse.item.user.item);
        router.push('/');
        return {
          success: true,
          message: '회원가입에 성공했습니다. 자동으로 로그인됩니다.',
        };
      } else {
        throw new Error('로그인 실패');
      }
    } catch (loginError) {
      console.error('자동 로그인 실패:', loginError);
      return {
        success: false,
        message:
          '회원가입에 성공했지만 자동 로그인에 실패했습니다. 수동으로 로그인해주세요.',
      };
    }
  };

  return autoLogin;
};
