import { useRouter } from 'next/router';
import React from 'react';

import styles from './DetailCard.module.scss';

interface DetailCardProps {
  title: string;
  content: string;
  buttonText: string;
  onButtonClick?: () => void;
}

function DetailCard({ title, content, buttonText, onButtonClick }: DetailCardProps) {
  const router = useRouter();

  const PageMove = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      router.push('/PostMyPage');
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.mainContainer}>
        <h1 className={styles.profileTitle}>{title}</h1>
        <div className={styles.profileBox}>
          <p className={styles.profileContent}>{content}</p>
          <button onClick={PageMove} className={styles.profileButton}><span>{buttonText}</span></button>
        </div>
      </div>
    </main>
  );
}

export default DetailCard;