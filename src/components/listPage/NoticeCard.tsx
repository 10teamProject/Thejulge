import Image from 'next/image';

import arrow from '../../../public/assets/images/arrow.png';
import location from '../../../public/assets/images/location.png';
import timer from '../../../public/assets/images/timers.png';
import styles from './NoticeCard.module.scss';

export default function NoticeCard() {
  return (
    <>
      <div className={styles.container}>
        <img className={styles.storeImage} alt="가게 이미지" />
        <h3 className={styles.storeName}>맛집</h3>
        <div className={styles.detailSection}>
          <Image src={timer} alt="시간" />
          <p className={styles.detail}>2023-02-31 15:00~18:00 (3시간)</p>
        </div>
        <div className={styles.detailSection}>
          <Image src={location} alt="장소" style={{ margin: '0 2px 0 2px' }} />
          <p className={styles.detail}>서울시 강남구</p>
        </div>
        <div className={styles.detailSection}>
          <p className={styles.price}>12,000원</p>
          <div className={styles.badge}>
            기존 시급보다 50%️️
            <Image src={arrow} alt="화살표" />
          </div>
        </div>
      </div>
    </>
  );
}
