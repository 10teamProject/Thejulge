import Image from 'next/image';
import { useEffect, useState } from 'react';

import arrow from '@/public/assets/images/arrow.png';
import location from '@/public/assets/images/location.png';
import timer from '@/public/assets/images/timers.png';
import {
  calculateEndTime,
  calculateHourlyPayIncrease,
  formatDate,
} from '@/utils/NoticeCard/CalculateThings';
import { Notice } from '@/utils/NoticeCard/NoticesType';

import styles from './NoticeCard.module.scss';

interface NoticeCardProps {
  notice: Notice;
}

const NoticeCard: React.FC<NoticeCardProps> = ({ notice }) => {
  const { hourlyPay, startsAt, workhour, shop } = notice;
  const { name, address1, imageUrl, originalHourlyPay } = shop.item;

  const increaseRate = calculateHourlyPayIncrease(originalHourlyPay, hourlyPay);
  const roundedIncreaseRate = Math.round(increaseRate);
  const formattedStartTime = formatDate(startsAt);
  const endTime = calculateEndTime(startsAt, workhour);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.storeImage}>
          <Image
            src={imageUrl}
            fill
            alt="가게 이미지"
            style={{
              objectFit: 'cover',
            }}
          />
        </div>
        <h3 className={styles.storeName}>{name}</h3>
        <div className={styles.detailSection}>
          <Image src={timer} alt="시간" />
          <p className={styles.detail}>
            {formattedStartTime} ~ {endTime} ({workhour}시간)
          </p>
        </div>
        <div className={styles.detailSection}>
          <Image src={location} alt="장소" style={{ margin: '0 2px 0 2px' }} />
          <p className={styles.detail}>{address1}</p>
        </div>
        <div className={styles.detailSection}>
          <p className={styles.price}>{hourlyPay}원</p>
          <div className={styles.badge}>
            기존 시급보다 {roundedIncreaseRate}%️️
            <Image src={arrow} alt="화살표" />
          </div>
        </div>
      </div>
    </>
  );
};
export default NoticeCard;
