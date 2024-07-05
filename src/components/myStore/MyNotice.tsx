import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import NoNotice from '@/components/myStore/NoNotice';
import { Pagination } from '@/components/common/PageNation';
import LoadingSpinner from '@/components/common/Spinner';
import { GetMyNotice } from '@/pages/api/GetMyNotice';
import locationIcon from '@/public/assets/icon/location.svg';
import timeIcon from '@/public/assets/icon/timer.svg';
import arrowIcon from '@/public/assets/icon/up_icon.svg';
import { Item, RequestParams, Shop } from '@/types/myStoreType';
import {
  calculateEndTime,
  formatDate,
} from '@/utils/NoticeCard/CalculateThings';

import styles from './MyNotice.module.scss';

interface MyNoticeProps {
  shop: Shop;
}

const ITEMS_PER_PAGE = 6;

const MyNotice: React.FC<MyNoticeProps> = ({ shop }) => {
  const [notices, setNotices] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      const params: RequestParams = {
        offset: (currentPage - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
      };
      const response = await GetMyNotice(shop.id, params);
      if (response) {
        setNotices(response.items.map((item) => item.item));
        setTotalPages(Math.ceil(response.count / ITEMS_PER_PAGE));
      }
      setLoading(false);
    };

    fetchNotices();
  }, [shop.id, currentPage]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (notices.length === 0 && currentPage === 1) {
    return <NoNotice shopId={shop.id} />;
  }

  const handleNoticeClick = (noticeId: string) => {
    router.push(`/mystore/${shop.id}/notice/${noticeId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className={styles.noticeGrid}>
        {notices.map((notice) => {
          const formattedStartTime = formatDate(notice.startsAt);
          const endTime = calculateEndTime(notice.startsAt, notice.workhour);

          return (
            <div
              key={notice.id}
              className={`${styles.noticeCard} ${notice.closed ? styles.closed : ''}`}
              onClick={() => handleNoticeClick(notice.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.imageContainer}>
                <Image
                  src={shop.imageUrl}
                  alt="가게 이미지"
                  className={styles.noticeImage}
                  width={280}
                  height={160}
                />
                {notice.closed && (
                  <div className={styles.closedOverlay}>마감 완료</div>
                )}
              </div>
              <div className={styles.noticeContent}>
                <h3 className={styles.noticeTitle}>{shop.name}</h3>
                <div className={styles.noticeInfo}>
                  <span className={styles.noticeTime}>
                    <Image
                      src={timeIcon}
                      alt="시간아이콘"
                      width={16}
                      height={16}
                    />
                    {formattedStartTime} ~ {endTime} ({notice.workhour}시간)
                  </span>
                  <span className={styles.noticeLocation}>
                    <Image
                      src={locationIcon}
                      alt="위치아이콘"
                      width={16}
                      height={16}
                    />
                    {shop.address1}
                  </span>
                </div>
                <div className={styles.noticePay}>
                  <span className={styles.payAmount}>
                    {notice.hourlyPay.toLocaleString()}원
                  </span>
                  {notice.hourlyPay > shop.originalHourlyPay && (
                    <span className={styles.payIncrease}>
                      기존 시급보다{' '}
                      {Math.round(
                        (notice.hourlyPay / shop.originalHourlyPay - 1) * 100,
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default MyNotice;
