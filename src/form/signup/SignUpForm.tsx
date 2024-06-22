import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Input from '@/components/auth/InputComponents';
import RadioGroup from '@/components/auth/RadioButton';
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
  const [error, setError] = useState<string | null>(null);

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
      const response = await SignupUser(requestData);
      if (response) {
        console.log('회원가입 성공');
        router.push('/login');
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  });

  return (
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
      {error && <span className={styles.errorMessage}>{error}</span>}
      <button className={styles.submitButton} type="submit" disabled={!isValid}>
        가입하기
      </button>
    </form>
  );
}

export default SignUpForm;
