import Image from 'next/image';
import { useRouter } from 'next/router';

import yellowarrow from '@/public/assets/icon/arrow_yellow.svg';
import location from '@/public/assets/icon/location.svg';
import timer from '@/public/assets/icon/timer.svg';
import arrow from '@/public/assets/images/arrow.png';
import grayLocation from '@/public/assets/images/location_gray.png';
import grayTimer from '@/public/assets/images/timer_gray.png';
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
  const { hourlyPay, startsAt, workhour, shop, closed } = notice;
  const { name, address1, imageUrl, originalHourlyPay } = shop.item;

  const increaseRate = calculateHourlyPayIncrease(originalHourlyPay, hourlyPay);
  const roundedIncreaseRate = Math.round(increaseRate);
  const formattedStartTime = formatDate(startsAt);
  const endTime = calculateEndTime(startsAt, workhour);
  const router = useRouter();

  const formattedPay = hourlyPay.toLocaleString();
  const backgroundClass = (() => {
    if (roundedIncreaseRate >= 50) {
      return styles.yellow5;
    } else if (roundedIncreaseRate > 30) {
      return styles.yellow4;
    } else if (roundedIncreaseRate > 0) {
      return styles.yellow3;
    } else {
      return styles.hidden;
    }
  })();

  const handleClick = () => {
    router.push(`/detailPage/${shop.item.id}/${notice.id}`);
  };

  const isExpired = new Date(startsAt) < new Date();

  const isClosedOrExpired = closed || isExpired;
  const overlayText = closed ? '마감 완료' : '지난 공고';
  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={`${styles.storeImage} `}>
        {isClosedOrExpired && (
          <div className={styles.closedOverlay}>{overlayText}</div>
        )}
        <Image
          src={imageUrl}
          fill
          alt="가게 이미지"
          style={{ objectFit: 'cover' }}
          className={isClosedOrExpired ? styles.closedImage : ''}
        />
      </div>
      <h3
        className={`${styles.storeName} ${isClosedOrExpired ? styles.closedText : ''}`}
      >
        {name}
      </h3>
      <div
        className={`${styles.detailSection} ${isClosedOrExpired ? styles.closedText : ''}`}
      >
        {isClosedOrExpired ? (
          <Image src={grayTimer} alt="시간" className={styles.iconImage} />
        ) : (
          <Image src={timer} alt="시간" className={styles.iconImage} />
        )}
        <p
          className={`${styles.detail} ${isClosedOrExpired ? styles.closedText : ''}`}
        >
          {formattedStartTime} ~ {endTime} ({workhour}시간)
        </p>
      </div>
      <div
        className={`${styles.detailSection} ${isClosedOrExpired ? styles.closedText : ''}`}
      >
        {isClosedOrExpired ? (
          <Image src={grayLocation} alt="장소" className={styles.iconImage} />
        ) : (
          <Image src={location} alt="장소" className={styles.iconImage} />
        )}
        <p
          className={`${styles.detail} ${isClosedOrExpired ? styles.closedText : ''}`}
        >
          {address1}
        </p>
      </div>
      <div className={styles.priceSection}>
        <p
          className={`${styles.price} ${isClosedOrExpired ? styles.closedText : ''}`}
        >
          {formattedPay}원
        </p>
        <div
          className={`${styles.badge} ${backgroundClass} ${isClosedOrExpired ? styles.hidden : ''}`}
        >
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
        <div className={styles.hoverDetails}>
          <p>{formattedPay}원</p>
          <p>기존 시급보다 {roundedIncreaseRate}%</p>
        </div>
      </div>
    </div>
  );
};

export default NoticeCard;
