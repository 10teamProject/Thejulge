import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { useAuth } from '@/contexts/AuthProvider';

import styles from './Header.module.scss';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        +HE JULGE
      </Link>
      <div className={styles.searchBar}>
        <input type="text" placeholder="가게 이름으로 찾아보세요" />
      </div>
      <nav className={styles.nav}>
        {!user ? (
          <>
            <Link href="/login">로그인</Link>
            <Link href="/signup">회원가입</Link>
          </>
        ) : user.type === 'employee' ? (
          <>
            <Link href="/profile">내 프로필</Link>
            <button onClick={handleLogout} className={styles.logoutButton}>
              로그아웃
            </button>
          </>
        ) : user.type === 'employer' ? (
          <>
            <Link href="/listPage">내 가게</Link>
            <button onClick={handleLogout} className={styles.logoutButton}>
              로그아웃
            </button>
          </>
        ) : null}
      </nav>
    </header>
  );
};

export default Header;
