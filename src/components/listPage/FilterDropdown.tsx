import React, { useEffect, useState, ChangeEvent } from 'react';
import styles from './FilterDropdown.module.scss';
import Image from 'next/image';
import X from '@/public/assets/images/black_x.png';

export default function FilterDropdown() {
  const [isFilterOpen, setisFilterOpen] = useState(false);
  const [minDate, setMinDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [filterPrice, setFilterPrice] = useState('');

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
  );
}
