import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Modal from '@/components/auth/ErrorModal';
import Input from '@/components/auth/InputComponents';
import { useAuth } from '@/contexts/AuthProvider';
import { LoginUser } from '@/pages/api/LoginUser';
import { loginSchema } from '@/utils/validation/Schema';

import styles from './LoginForm.module.scss';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const { setUser, setToken } = useAuth();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });

  const handleLogin = handleSubmit(async (data: LoginFormValues) => {
    try {
      const { email, password } = data;
      const requestData = { email, password };
      const response = await LoginUser(requestData);
      if (response && response.item && response.item.token) {
        console.log('로그인 성공');
        setToken(response.item.token);
        setUser({
          id: response.item.user.item.id,
          email: response.item.user.item.email,
          type: response.item.user.item.type as 'employee' | 'employer',
        });
        router.push('/listPage');
      } else {
        throw new Error('토큰을 받지 못했습니다.');
      }
    } catch (error: unknown) {
      console.error('로그인 실패:', error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          setModalMessage('존재하지 않거나 비밀번호가 일치하지 않습니다');
        } else {
          setModalMessage(`로그인에 실패했습니다: ${error.message}`);
        }
      } else if (error instanceof Error) {
        setModalMessage(`로그인에 실패했습니다: ${error.message}`);
      } else {
        setModalMessage('알 수 없는 오류가 발생했습니다.');
      }
      setIsModalOpen(true);
    }
  });

  return (
    <>
      <form className={styles.form} onSubmit={handleLogin}>
        <Input<LoginFormValues>
          label="이메일"
          name="email"
          type="email"
          placeholder="입력"
          register={register}
          error={errors.email?.message}
        />
        <Input<LoginFormValues>
          label="비밀번호"
          name="password"
          type="password"
          placeholder="입력"
          register={register}
          error={errors.password?.message}
        />
        <button
          className={styles.submitButton}
          type="submit"
          disabled={!isValid}
        >
          로그인
        </button>
      </form>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="로그인 오류"
        message={modalMessage}
      />
    </>
  );
}
