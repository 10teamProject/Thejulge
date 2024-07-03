import Image from 'next/image';
import Link from 'next/link';

import yellowArrow from '@/public/assets/icon/arrow_yellow.svg';
import location from '@/public/assets/icon/location.svg';
import time from '@/public/assets/icon/timer.svg';
import arrow from '@/public/assets/images/arrow.png';
import graylocation from '@/public/assets/images/location_gray.png';
import graytime from '@/public/assets/images/timer_gray.png';
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
  const { hourlyPay, startsAt, workhour, closed } = recentNoticeData;
  const { name, imageUrl, address1, originalHourlyPay } =
    recentNoticeData.shop.item;
  const increaseRate = calculateHourlyPayIncrease(originalHourlyPay, hourlyPay);
  const newIncreaseRate = Math.round(increaseRate);
  const startTime = formatDate(startsAt);
  const endTime = calculateEndTime(startsAt, workhour);

  const shopid = recentNoticeData.shop.item.id;
  const noticeid = recentNoticeData.id;

  return (
    <>
      <Link href={`/detailPage/${shopid}/${noticeid}`}>
        <div className={`${styles.card_container}`}>
          <div className={styles.img_box}>
            {closed && <div className={styles.img_closed}> 마감완료</div>}
            <Image
              src={imageUrl}
              fill
              alt="카드이미지"
              className={`${styles.card_img} ${closed ? styles.card_img_closed : ''} `}
            />
          </div>
          <div
            className={`${styles.shop_info}  ${closed ? styles.card_closed : ''}`}
          >
            <div className={styles.shop_info_box}>
              <div className={styles.shop_name}>{name}</div>
              <div className={styles.workAt}>
                {closed ? (
                  <Image src={graytime} alt="알바시간" />
                ) : (
                  <Image src={time} alt="알바시간" />
                )}
                {startTime}~{endTime} ({workhour}시간)
              </div>
              <div className={styles.address}>
                {closed ? (
                  <Image src={graylocation} alt="위치" />
                ) : (
                  <Image src={location} alt="위치" />
                )}
                {address1}
              </div>
            </div>
            <div className={styles.pay_box}>
              <div className={styles.hourlPay}>
                {hourlyPay.toLocaleString('ko-KR')}원
              </div>
              {originalHourlyPay < hourlyPay && (
                <div
                  className={`${closed ? styles.hidden : styles.increaseRate}`}
                >
                  <p className={styles.badge}>
                    기존 시급보다 {newIncreaseRate}%
                  </p>
                  <Image src={arrow} alt="가격상승" className={styles.arrow} />
                  <Image
                    src={yellowArrow}
                    alt="가격상승"
                    className={styles.yellowArrow}
                  />
                </div>
              )}
              <div className={styles.hover_pay}>
                <div>{hourlyPay.toLocaleString('ko-KR')}원</div>
                <div>기존 시급보다 {newIncreaseRate}%</div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default Card;
