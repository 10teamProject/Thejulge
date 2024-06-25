import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';

import FilterDropdown from '@/components/listPage/FilterDropdown';
import NoticeCard from '@/components/listPage/NoticeCard';

import { instance } from '../api/AxiosInstance';
import styles from './ListPage.module.scss';
import { Notice, NoticeResponse } from '@/utils/NoticeCard/NoticesType';

type Props = {
  initialNotices: Notice[];
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  try {
    const response = await instance.get<NoticeResponse>('/notices');
    const initialNotices: Notice[] = response.data.items.map(
      (item) => item.item,
    );

    return {
      props: {
        initialNotices,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        initialNotices: [],
      },
    };
  }
};

const ListPage: React.FC<Props> = ({ initialNotices }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [label, setLabel] = useState('마감임박순');
  const [notices, setNotices] = useState<Notice[]>(initialNotices);

  useEffect(() => {
    console.log('Initial Notices:', initialNotices); // 데이터 확인
    console.log('Notices:', notices); // 데이터 확인
  }, [initialNotices, notices]);

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
          <div className={styles.fitNotice}>
            {notices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </div>
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
