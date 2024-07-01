import Image from 'next/image';
import { useRouter } from 'next/router';

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
  recentNoticeData: Notice; // 로컬 스토리지 정보
}

const Card: React.FC<DetailCardProps> = ({ recentNoticeData }) => {
  // console.log('notice : ', recentNoticeData); // 넘어오는 데이터 확인

  const { hourlyPay, startsAt, workhour } = recentNoticeData;
  const { name, imageUrl, address1, originalHourlyPay } =
    recentNoticeData.shop.item;

  const increaseRate = calculateHourlyPayIncrease(originalHourlyPay, hourlyPay);
  const startTime = formatDate(startsAt);
  const endTime = calculateEndTime(startsAt, workhour);

  return (
    <>
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
    </>
  );
};

export default Card;
