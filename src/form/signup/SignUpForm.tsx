import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { SignupUser } from '@/pages/api/SignupUser';
import { signUpSchema } from '@/utils/validation/Schema';

import styles from './SignUp.module.scss';

interface SignUpFormInput {
  email: string;
  password: string;
  passwordConfirmation: string;
  type: 'employee' | 'employer';
}

const SignUpForm = () => {
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
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="email">
          이메일
        </label>
        <input
          className={styles.input}
          type="email"
          id="email"
          placeholder="입력"
          {...register('email')}
        />
        {errors.email && (
          <span className={styles.errorMessage}>{errors.email.message}</span>
        )}
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="password">
          비밀번호
        </label>
        <input
          className={styles.input}
          type="password"
          id="password"
          placeholder="입력"
          {...register('password')}
        />
        {errors.password && (
          <span className={styles.errorMessage}>{errors.password.message}</span>
        )}
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="passwordConfirmation">
          비밀번호 확인
        </label>
        <input
          className={styles.input}
          type="password"
          id="passwordConfirmation"
          placeholder="입력"
          {...register('passwordConfirmation')}
        />
        {errors.passwordConfirmation && (
          <span className={styles.errorMessage}>
            {errors.passwordConfirmation.message}
          </span>
        )}
      </div>
      <div className={styles.inputGroup}>
        <span className={styles.label}>회원 유형</span>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              className={styles.radioInput}
              type="radio"
              value="employee"
              {...register('type')}
            />
            <span className={styles.radioButton}>알바님</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              className={styles.radioInput}
              type="radio"
              value="employer"
              {...register('type')}
            />
            <span className={styles.radioButton}>사장님</span>
          </label>
        </div>
        {errors.type && (
          <span className={styles.errorMessage}>{errors.type.message}</span>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
      <button className={styles.submitButton} type="submit" disabled={!isValid}>
        가입하기
      </button>
    </form>
  );
};

export default SignUpForm;
