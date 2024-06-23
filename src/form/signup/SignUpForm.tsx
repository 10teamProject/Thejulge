import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Modal from '@/components/auth/ErrorModal';
import Input from '@/components/auth/InputComponents';
import RadioGroup from '@/components/auth/RadioButton';
import { useAuth } from '@/contexts/AuthProvider';
import { LoginUser } from '@/pages/api/LoginUser';
import { SignupUser } from '@/pages/api/SignupUser';
import { signUpSchema } from '@/utils/validation/Schema';

import styles from './SignUp.module.scss';

interface SignUpFormInput {
  email: string;
  password: string;
  passwordConfirmation: string;
  type: 'employee' | 'employer';
}

function SignUpForm() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const { setUser, setToken } = useAuth();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<SignUpFormInput>({
    resolver: yupResolver(signUpSchema),
    mode: 'onChange',
  });

  const handleSignUp = handleSubmit(async (data: SignUpFormInput) => {
    try {
      const { email, password, type } = data;
      const requestData = { email, password, type };
      const signupResponse = await SignupUser(requestData);

      // 회원가입 성공 (201 상태 코드)
      if (signupResponse?.status === 201) {
        try {
          const loginResponse = await LoginUser({ email, password });
          if (loginResponse && loginResponse.item && loginResponse.item.token) {
            Cookies.set('token', loginResponse.item.token, { expires: 7 });
            setToken(loginResponse.item.token);
            setUser(loginResponse.item.user.item);
            setModalMessage('회원가입에 성공했습니다. 자동으로 로그인됩니다.');
          } else {
            throw new Error('로그인 실패');
          }
        } catch (loginError) {
          console.error('자동 로그인 실패:', loginError);
          setModalMessage(
            '회원가입에 성공했지만 자동 로그인에 실패했습니다. 수동으로 로그인해주세요.',
          );
        }
      } else {
        // 201이 아닌 다른 상태 코드인 경우
        throw new Error('회원가입 실패');
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          setModalMessage('이미 사용 중인 이메일입니다.');
        } else {
          setModalMessage(
            `회원가입에 실패했습니다: ${error.response?.data?.message || '알 수 없는 오류가 발생했습니다.'}`,
          );
        }
      } else {
        setModalMessage('이미 사용 중인 이메일입니다.');
      }
    } finally {
      setIsModalOpen(true);
    }
  });

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (modalMessage.includes('자동으로 로그인됩니다')) {
      router.push('/');
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSignUp}>
        <Input<SignUpFormInput>
          label="이메일"
          name="email"
          type="email"
          placeholder="입력"
          register={register}
          error={errors.email?.message}
        />
        <Input<SignUpFormInput>
          label="비밀번호"
          name="password"
          type="password"
          placeholder="입력"
          register={register}
          error={errors.password?.message}
        />
        <Input<SignUpFormInput>
          label="비밀번호 확인"
          name="passwordConfirmation"
          type="password"
          placeholder="입력"
          register={register}
          error={errors.passwordConfirmation?.message}
        />
        <RadioGroup<SignUpFormInput>
          label="회원 유형"
          name="type"
          options={[
            { value: 'employee', label: '알바님' },
            { value: 'employer', label: '사장님' },
          ]}
          register={register}
          error={errors.type?.message}
        />
        <button
          className={styles.submitButton}
          type="submit"
          disabled={!isValid}
        >
          가입하기
        </button>
      </form>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="회원가입"
        message={modalMessage}
      />
    </>
  );
}

export default SignUpForm;
