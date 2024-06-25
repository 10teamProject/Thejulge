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
import { Notice } from '@/utils/NoticeCard/NoticesType';

import styles from './Card.module.scss';

interface DetailCardProps {
  notice: Notice;
}

const Card: React.FC<DetailCardProps> = ({ notice }) => {
  console.log('notice : ', notice);
  const { hourlyPay, startsAt, workhour } = notice;
  const { name, imageUrl, address1, originalHourlyPay } = notice.shop.item;
  // console.log('card', notice); // 넘어오는 데이터 확인

  const increaseRate = calculateHourlyPayIncrease(originalHourlyPay, hourlyPay);
  const startTime = formatDate(startsAt);
  const endTime = calculateEndTime(startsAt, workhour);

  return (
    <div className={styles.card_container}>
      <div className={styles.img_box}>
        <Image className={styles.shop_img} src={logo} alt="카드이미지" />
      </div>
      <div className={styles.shop_info}>
        <div className={styles.shop_info_box}>
          <div className={styles.shop_name}>{name}</div>
          <div className={styles.workAt}>
            <Image src={time} alt="알바시간" />
            {startTime}~{endTime} ({workhour}시간)
          </div>
          <div className={styles.address}>
            <Image src={address} alt="위치" />
            {address1}
          </div>
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
    </div>
  );
};

export default Card;
