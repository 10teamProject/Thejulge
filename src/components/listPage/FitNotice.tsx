import { useEffect, useState } from 'react';

import { Notice } from '@/utils/NoticeCard/NoticesType';

import styles from './FitNotice.module.scss';
import NoticeCard from './NoticeCard';

type Props = {
  initialNotices: Notice[];
};

const FitNotice: React.FC<Props> = ({ initialNotices }) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  useEffect(() => {
    const topNotices = initialNotices
      .sort((a, b) => b.hourlyPay - a.hourlyPay)
      .slice(0, 9);
    setNotices(topNotices);
    console.log('top', notices);
  }, [initialNotices]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex + 1) % Math.ceil(notices.length / itemsPerPage),
      );
    }, 10000); // 10초마다 바뀜

    return () => clearInterval(interval);
  }, [notices]);

  const currentNotices = notices.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage,
  );

  return (
    <div className={styles.carousel}>
      <div className={styles.carouselContainer}>
        {currentNotices.map((notice) => (
          <NoticeCard key={notice.id} notice={notice} />
        ))}
      </div>
    </div>
  );
};

export default FitNotice;
