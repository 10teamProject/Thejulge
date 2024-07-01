import Image from 'next/image';
import { useEffect, useState } from 'react';

import yellowarrow from '@/public/assets/icon/arrow_yellow.svg';
import location from '@/public/assets/icon/location.svg';
import timer from '@/public/assets/icon/timer.svg';
import arrow from '@/public/assets/images/arrow.png';
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
          <Image src={timer} alt="시간" className={styles.iconImage} />
          <p className={styles.detail}>
            {formattedStartTime} ~ {endTime} ({workhour}시간)
          </p>
        </div>
        <div className={styles.detailSection}>
          <Image src={location} alt="장소" className={styles.iconImage} />
          <p className={styles.detail}>{address1}</p>
        </div>
        <div className={styles.priceSection}>
          <p className={styles.price}>{hourlyPay}원</p>
          <div className={styles.badge}>
            <p className={styles.increaseRate}>
              기존 시급보다 {roundedIncreaseRate}%️️
            </p>
            <Image src={arrow} alt="화살표" className={styles.arrow} />
            <Image
              src={yellowarrow}
              alt="화살표"
              className={styles.yellowArrow}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default NoticeCard;
