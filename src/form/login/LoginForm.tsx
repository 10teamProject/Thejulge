import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Input from '@/components/auth/InputComponets';
import { LoginUser } from '@/pages/api/LoginUser';
import { loginSchema } from '@/utils/validation/Schema';

import styles from './LoginForm.module.scss';

interface LoginFormValues {
  email: string;
  password: string;
}
export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

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
      if (response) {
        console.log('로그인 성공');
        router.prefetch('/');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
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
    </>
  );
}
