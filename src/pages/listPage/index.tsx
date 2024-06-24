import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';

import styles from './ListPage.module.scss';
import NoticeCard from '@/components/listPage/NoticeCard';
import FilterDropdown from '@/components/listPage/FilterDropdown';
import { instance } from '../api/AxiosInstance';

interface Notice {
  id: string;
  hourlyPay: number;
  startsAt: string;
  workhour: number;
  description: string;
  closed: boolean;
  shop: {
    id: string;
    name: string;
    category: string;
    address1: string;
    imageUrl: string;
    originalHourlyPay: number;
  };
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const response = await instance.get('/notices');
    const data = response.data.items.map((item: any) => ({
      id: item.item.id,
      hourlyPay: item.item.hourlyPay,
      startsAt: item.item.startsAt,
      workhour: item.item.workhour,
      description: item.item.description,
      closed: item.item.closed,
      shop: {
        id: item.item.shop.item.id,
        name: item.item.shop.item.name,
        category: item.item.shop.item.category,
        address1: item.item.shop.item.address1,
        imageUrl: item.item.shop.item.imageUrl,
        originalHourlyPay: item.item.shop.item.originalHourlyPay,
      },
    }));

    return { props: { initialNotices: data } };
  } catch (error) {
    console.error('Failed to fetch notices', error);
    return { props: { initialNotices: [] } };
  }
};

interface ListPageProps {
  initialNotices: Notice[];
}
const ListPage: React.FC<ListPageProps> = ({ initialNotices }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [label, setLabel] = useState('마감임박순');
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  useEffect(() => {
    console.log('Initial Notices:', initialNotices); // 데이터 확인

    console.log(' Notices:', notices); // 데이터 확인
  }, [initialNotices]);
  const sortOptions = [
    { key: 'time', label: '마감임박순' },
    { key: 'pay', label: '시급많은순' },
    { key: 'hour', label: '시간적은순' },
    { key: 'shop', label: '가나다순' },
  ];

  const handleSortChange = (newSortBy: string, newLabel: string) => {
    setLabel(newLabel);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <div className={styles.customContainer}>
        <div className={styles.customSection}>
          <h2 className={styles.title}>맞춤 공고</h2>
          {notices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>전체 공고</h2>
          <div
            className={styles.sortDropdown}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {label} ▼
            {isDropdownOpen && (
              <ul className={styles.sortDropdownMenu}>
                {sortOptions.map((option) => (
                  <li
                    key={option.key}
                    className={`${styles.sortDropdownText} ${styles.dropdownLine}`}
                    onClick={() => handleSortChange(option.key, option.label)}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div
            className={styles.detailFilter}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            상세 필터
            {isFilterOpen && (
              <FilterDropdown setIsFilterOpen={setIsFilterOpen} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default ListPage;
