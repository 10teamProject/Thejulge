import Image from 'next/image';
import { useRouter } from 'next/router';

import locationIcon from '@/public/assets/icon/location.svg';
import timerIcon from '@/public/assets/icon/timer.svg';
import arrowIcon from '@/public/assets/images/arrow.png';
import { JobResponse } from '@/types/myStoreType';
import {
  calculateEndTime,
  formatDate,
} from '@/utils/NoticeCard/CalculateThings';

import styles from './MyNoticeDetail.module.scss';

interface NoticeCardProps {
  noticeData: JobResponse;
}

const NoticeCard: React.FC<NoticeCardProps> = ({ noticeData }) => {
  const router = useRouter();
  const { item } = noticeData;
  const increaseRate = Math.round(
    (item.hourlyPay / item.shop.item.originalHourlyPay - 1) * 100,
  );

  const formattedStartTime = formatDate(item.startsAt);
  const endTime = calculateEndTime(item.startsAt, item.workhour);

  const handleEditClick = () => {
    router.push(`/mystore/${item.shop.item.id}/editNotice/${item.id}`);
  };

  return (
    <div className={styles.CardWrapper}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <Image
            className={styles.image}
            src={item.shop.item.imageUrl}
            alt={item.shop.item.name}
            width={539}
            height={308}
            objectFit="cover"
          />
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>시급</h2>
          <div className={styles.payInfo}>
            <span className={styles.pay}>
              {item.hourlyPay.toLocaleString()}원
            </span>
            {increaseRate > 0 && (
              <span className={styles.increase}>
                기존 시급보다 {increaseRate}%
                <Image src={arrowIcon} alt="Increase" width={16} height={16} />
              </span>
            )}
          </div>
          <div className={styles.info}>
            <div className={styles.infoItem}>
              <Image src={timerIcon} alt="Time" width={20} height={20} />
              <span>
                {formattedStartTime} ~ {endTime} ({item.workhour}시간)
              </span>
            </div>
            <div className={styles.infoItem}>
              <Image src={locationIcon} alt="Location" width={20} height={20} />
              <span>{item.shop.item.address1}</span>
            </div>
          </div>
          <p className={styles.description}>{item.shop.item.description}</p>
          <button className={styles.applyButton} onClick={handleEditClick}>
            공고 편집하기
          </button>
        </div>
      </div>
      <div className={styles.descriptionCard}>
        <h3 className={styles.descriptionTitle}>공고 설명</h3>
        <p className={styles.descriptionContent}>{item.description}</p>
      </div>
    </div>
  );
};

export default NoticeCard;
