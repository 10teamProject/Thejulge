import Image from 'next/image';

import arrow from '@/public/assets/images/arrow.png';
import address from '@/public/assets/images/location.png';
import logo from '@/public/assets/images/logo.png';
import time from '@/public/assets/images/timers.png';
import {
  calculateEndTime,
  calculateHourlyPayIncrease,
  formatDate,
} from '@/utils/NoticeCard/CalculateThings';

import styles from './Card.module.scss';

interface CardProps {
  notice: {
    item: {
      id: string;
      closed?: boolean;
      hourlyPay: number;
      description: string;
      startsAt: string;
      workhour: number;
      shop: {
        item: {
          category: string;
          name: string;
          imageUrl: string;
          originalHourlyPay: number;
          address1: string;
          address2?: string;
          description: string;
        };
      };
    };
  };
}

const Card: React.FC<CardProps> = ({ notice }) => {
  const { hourlyPay, startsAt, workhour } = notice.item;
  const { name, imageUrl, address1, originalHourlyPay } = notice.item.shop.item;
  console.log('card', notice); // 넘어오는 데이터 확인

  const increaseRate = calculateHourlyPayIncrease(originalHourlyPay, hourlyPay);
  console.log(increaseRate);

  const startTime = formatDate(startsAt);
  const endTime = calculateEndTime(startsAt, workhour);

  return (
    <div className={styles.card_container}>
      <Image className={styles.shot_img} src={logo} alt="카드이미지" />
      <div className={styles.shop_name}>{name}</div>
      <div className={styles.workAt}>
        <Image src={time} alt="알바시간" />
        {startTime}~{endTime} ({workhour}시간)
      </div>
      <div className={styles.address}>
        <Image src={address} alt="위치" />
        {address1}
      </div>
      <div className={styles.hourlPay}>
        {hourlyPay}원
        {originalHourlyPay < hourlyPay && (
          <span>
            기존 시급보다 {increaseRate}%
            <Image src={arrow} alt="가격상승" />
          </span>
        )}
      </div>
    </div>
  );
};

export default Card;
