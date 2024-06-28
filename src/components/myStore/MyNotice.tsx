import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { GetMyNotice } from '@/pages/api/GetMyNotice';
import locationIcon from '@/public/assets/icon/location.svg';
import timeIcon from '@/public/assets/icon/timer.svg';
import arrowIcon from '@/public/assets/icon/up_icon.svg';
import { Item, RequestParams } from '@/types/myStoreType';

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
  const router = useRouter();

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

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const handleNoticeClick = (noticeId: string) => {
    router.push(`/mystore/${shop_id}/notice/${noticeId}`);
  };

  return (
    <div className={styles.noticeGrid}>
      {notices.map((notice) => {
        const startTime = new Date(notice.startsAt);
        const endTime = new Date(
          startTime.getTime() + notice.workhour * 60 * 60 * 1000,
        );

        return (
          <div
            key={notice.id}
            className={styles.noticeCard}
            onClick={() => handleNoticeClick(notice.id)}
            style={{ cursor: 'pointer' }}
          >
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
                  <Image
                    src={timeIcon}
                    alt="시간아이콘"
                    width={16}
                    height={16}
                  />
                  {startTime.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}{' '}
                  {formatTime(startTime)}~{formatTime(endTime)} (
                  {notice.workhour}시간)
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
                    {Math.round(
                      (notice.hourlyPay / originalHourlyPay - 1) * 100,
                    )}
                    %
                    <Image
                      className={styles.arrowIcon}
                      src={arrowIcon}
                      alt="상승아이콘"
                      width={16}
                      height={16}
                    />
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyNotice;
