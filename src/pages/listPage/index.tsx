import Image from 'next/image';
import { useState } from 'react';

import NoticeCard from '@/components/listPage/NoticeCard';
import X from '@/public/assets/images/black_x.png';

import styles from './ListPage.module.scss';

const ListPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setisFilterOpen] = useState(false);
  const [label, setLabel] = useState('마감임박순');

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
          <NoticeCard />
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
            onClick={() => setisFilterOpen(!isFilterOpen)}
          >
            상세 필터
            {isFilterOpen && (
              <div className={styles.filterContainer}>
                <div className={styles.fliterTop}>
                  상세필터
                  <Image
                    src={X}
                    alt="X"
                    className={styles.xImage}
                    onClick={() => setisFilterOpen(!isFilterOpen)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default ListPage;
