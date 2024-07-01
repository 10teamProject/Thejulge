import { useEffect, useState } from 'react';

import { Notice } from '@/utils/NoticeCard/NoticesType';

import styles from './FitNotice.module.scss';
import NoticeCard from './NoticeCard';

type Props = {
  initialNotices: Notice[];
};

const FitNotice: React.FC<Props> = ({ initialNotices }) => {
  const topNotices = initialNotices
    .sort((a, b) => b.hourlyPay - a.hourlyPay)
    .slice(0, 3);

  return (
    <div className={styles.customContainer}>
      <div className={styles.customSection}>
        <h2 className={styles.title}>맞춤 공고</h2>
        <div className={styles.fitNotice} />
        <div className={styles.carousel}>
          <div className={styles.carouselContainer}>
            {topNotices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitNotice;
