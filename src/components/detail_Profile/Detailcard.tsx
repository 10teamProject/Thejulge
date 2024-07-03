import { useRouter } from 'next/router';
import React from 'react';

import styles from './DetailCard.module.scss';

interface DetailCardProps {
  title: string;
  content: string;
  buttonText: string;
}


const DetailCard: React.FC<DetailCardProps> = ({ title, content, buttonText }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/PostMyPage');
  };

  return (
    <main className={styles.main}>
      <div className={styles.mainContainer}>
        <h1 className={styles.profileTitle}>{title}</h1>
        <div className={styles.profileBox}>
          <p className={styles.profileContent}>{content}</p>
          <button onClick={handleClick} className={styles.profileButton}><span>{buttonText}</span></button>
        </div>
      </div>
    </main>
  );
};

export default DetailCard;