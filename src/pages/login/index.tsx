import Image from 'next/image';
import Link from 'next/link';

import logo from '@/../public/assets/images/biglogo.png';
import LoginForm from '@/form/login/LoginForm';

import styles from './LoginPage.module.scss';

export default function LoginPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <div className={styles.logoContainer}>
          <Image src={logo} alt="로고" width={248} height={45} />
        </div>
        <LoginForm />
        <Link className={styles.loginLink} href="/signup">
          회원이 아닌가요? 회원가입하기
        </Link>
      </div>
    </div>
  );
}
