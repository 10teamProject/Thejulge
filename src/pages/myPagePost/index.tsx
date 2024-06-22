import React from 'react';
import styles from './myPagePost.module.scss';


const myPage = () => {
  return (
    <main className={styles.main}>
      <div className={styles.mainContainer}>
        <h1 className={styles.profileTitle}>내 프로필</h1>
        <div className={styles.profilebox}>
          <p>내 프로필을 등록하고 원하는 가게에 지원해 보세요.</p>
          <button>내 프로필 등록하기</button>
        </div>
      </div>
    </main>
  );
};

export default myPage;