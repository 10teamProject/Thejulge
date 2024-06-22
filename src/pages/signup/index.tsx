import Image from 'next/image';
import Link from 'next/link';

import logo from '@/../public/assets/images/biglogo.png';
import SignUpForm from '@/form/signup/SignUpForm';

import styles from './SignUpPage.module.scss';

export default function SignUpPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <div className={styles.logoContainer}>
          <Image src={logo} alt="로고" width={248} height={45} />
        </div>
        <SignUpForm />
        <Link className={styles.loginLink} href="/login">
          이미 가입하셨나요? 로그인하기
        </Link>
      </div>
    </div>
  );
}
