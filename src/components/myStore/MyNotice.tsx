import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { GetMyNotice } from '@/pages/api/GetMyNotice';
import locationIcon from '@/public/assets/icon/location.svg';
import timeIcon from '@/public/assets/icon/timer.svg';
import { Item, RequestParams, ResponseStructure } from '@/types/myStoreType';

import styles from './MyNotice.module.scss';

interface MyNoticeProps {
  shop_id: string;
  imageUrl: string;
  address1: string;
  originalHourlyPay: number;
}

const MyNotice: React.FC<MyNoticeProps> = ({
  shop_id,
  imageUrl,
  address1,
  originalHourlyPay,
}) => {
  const [notices, setNotices] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      const params: RequestParams = { offset: 0, limit: 6 };
      const response = await GetMyNotice(shop_id, params);
      if (response) {
        setNotices(response.items.map((item) => item.item));
      }
      setLoading(false);
    };

    fetchNotices();
  }, [shop_id]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className={styles.noticeGrid}>
      {notices.map((notice) => (
        <div key={notice.id} className={styles.noticeCard}>
          <div className={styles.imageContainer}>
            <img
              src={imageUrl}
              alt="가게 이미지"
              className={styles.noticeImage}
            />
            {notice.closed && (
              <div className={styles.closedOverlay}>마감 완료</div>
            )}
          </div>
          <div className={styles.noticeContent}>
            <h3 className={styles.noticeTitle}>{notice.description}</h3>
            <div className={styles.noticeInfo}>
              <span className={styles.noticeTime}>
                <Image src={timeIcon} alt="시간아이콘" width={16} height={16} />
                {new Date(notice.startsAt).toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                ~{notice.workhour}시간
              </span>
              <span className={styles.noticeLocation}>
                <Image
                  src={locationIcon}
                  alt="위치아이콘"
                  width={16}
                  height={16}
                />
                {address1}
              </span>
            </div>
            <div className={styles.noticePay}>
              <span className={styles.payAmount}>
                {notice.hourlyPay.toLocaleString()}원
              </span>
              {notice.hourlyPay > originalHourlyPay && (
                <span className={styles.payIncrease}>
                  기존 시급보다{' '}
                  {Math.round((notice.hourlyPay / originalHourlyPay - 1) * 100)}
                  % ↑
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyNotice;
