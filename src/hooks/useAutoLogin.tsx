import { useRouter } from 'next/router';
import { useState } from 'react';

import { useAuth } from '@/contexts/AuthProvider';
import { LoginUser } from '@/pages/api/LoginUser';

interface AutoLoginResult {
  success: boolean;
  message: string;
}

export const useAutoLogin = () => {
  const router = useRouter();
  const { setUser, setToken } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const autoLogin = async (
    email: string,
    password: string,
  ): Promise<AutoLoginResult> => {
    try {
      const loginResponse = await LoginUser({ email, password });
      if (loginResponse && loginResponse.item && loginResponse.item.token) {
        setToken(loginResponse.item.token);
        setUser({
          id: loginResponse.item.user.item.id,
          email: loginResponse.item.user.item.email,
          type: loginResponse.item.user.item.type as 'employee' | 'employer',
        });
        setModalMessage('회원가입에 성공했습니다. 자동으로 로그인됩니다.');
        setIsModalOpen(true);
        return {
          success: true,
          message: '회원가입에 성공했습니다. 자동으로 로그인됩니다.',
        };
      } else {
        throw new Error('로그인 실패');
      }
    } catch (loginError) {
      console.error('자동 로그인 실패:', loginError);
      setModalMessage(
        '회원가입에 성공했지만 자동 로그인에 실패했습니다. 수동으로 로그인해주세요.',
      );
      setIsModalOpen(true);
      return {
        success: false,
        message:
          '회원가입에 성공했지만 자동 로그인에 실패했습니다. 수동으로 로그인해주세요.',
      };
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (modalMessage.includes('자동으로 로그인됩니다')) {
      router.push('/');
    }
  };

  return { autoLogin, isModalOpen, modalMessage, handleModalClose };
};
