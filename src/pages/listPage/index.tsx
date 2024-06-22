import React, { useEffect, useState, ChangeEvent } from 'react';
import styles from './ListPage.module.scss';
import Image from 'next/image';
import NoticeCard from '@/components/listPage/NoticeCard';
import X from '@/public/assets/images/black_x.png';

const ListPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setisFilterOpen] = useState(false);
  const [label, setLabel] = useState('마감임박순');
  const [minDate, setMinDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [filterPrice, setFilterPrice] = useState('');

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

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMinDate(today);
    setStartDate(today);
  }, []);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value;
    setStartDate(selectedDate);
  };

  const handleFilterPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      setFilterPrice(newValue);
    }
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
              <div
                className={styles.filterContainer}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.fliterTop}>
                  상세필터
                  <Image
                    src={X}
                    alt="X"
                    className={styles.xImage}
                    onClick={() => setisFilterOpen(!isFilterOpen)}
                  />
                </div>
                <p className={styles.filterName}>위치</p>
                <div className={styles.filterLocation}></div>
                <div className={styles.line} />
                <p className={styles.filterName}>시작일</p>
                <input
                  type="date"
                  className={styles.filterDate}
                  min={minDate}
                  value={startDate}
                  onChange={handleDateChange}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className={styles.line} />
                <p className={styles.filterName}>금액</p>
                <div className={styles.fliterTop}>
                  <input
                    value={filterPrice}
                    placeholder="입력"
                    className={styles.filterPrice}
                    onChange={handleFilterPriceChange}
                  ></input>
                  <p className={styles.filterPriceText}>원</p>
                  <p className={styles.filterName}>이상부터</p>
                </div>
                <div className={styles.filterBottom}>
                  <button className={styles.reset}>초기화</button>
                  <button className={styles.submit}>적용하기</button>
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
