import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';

import X from '@/public/assets/images/black_x.png';
import { formatDateForInput } from '@/utils/NoticeCard/CalculateThings';
import type { Option } from '@/utils/Options';
import { addressOptions } from '@/utils/Options';

import styles from './FilterDropdown.module.scss';

const sortedAddressOptions = addressOptions.sort((a, b) => {
  return a.value.localeCompare(b.value, 'ko');
});

interface FilterDropdownProps {
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onApply: (locations: string[], startDate: string, hourlyPay: number) => void;
  initialSelectedLocations: string[];
  initialStartDate: string;
  initialHourlyPay: number;
  onFilterCountChange: (count: number) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  setIsFilterOpen,
  onApply,
  initialSelectedLocations,
  initialStartDate,
  initialHourlyPay,
  onFilterCountChange,
}) => {
  const [minDate, setMinDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [hourlyPay, setHourlyPay] = useState<number>(0);
  const [selectedLocations, setSelectedLocations] = useState<Option[]>([]);

  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    setMinDate(today);
    setStartDate(initialStartDate ? formatDateForInput(initialStartDate) : '');
    setHourlyPay(initialHourlyPay);
    setSelectedLocations(
      initialSelectedLocations.map((location) => ({
        value: location,
      })),
    );
  }, [initialSelectedLocations, initialStartDate, initialHourlyPay]);

  useEffect(() => {
    const count =
      selectedLocations.length + (startDate ? 1 : 0) + (hourlyPay > 0 ? 1 : 0);
    onFilterCountChange(count);
  }, [selectedLocations, startDate, hourlyPay]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(event.target.value);
    setStartDate(selectedDate.toISOString().split('T')[0]);
  };

  const handleLocationClick = (location: Option) => {
    if (!selectedLocations.find((loc) => loc.value === location.value)) {
      setSelectedLocations([...selectedLocations, location]);
    }
  };

  const handleTagRemove = (value: string) => {
    setSelectedLocations(
      selectedLocations.filter((loc) => loc.value !== value),
    );
  };

  const handleHourlyPayChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      const numericValue = newValue === '' ? 0 : parseInt(newValue, 10); //빈 문자열인 경우 0으로 설정해서 NaN오류 안 나게 설정!
      setHourlyPay(numericValue);
    }
  };

  const handleResetClick = () => {
    setSelectedLocations([]);
    setStartDate('');
    setHourlyPay(0);
  };

  const handleApplyClick = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const formattedStartDate = startDate
      ? startDate === today
        ? `${startDate}T${now.toISOString().split('T')[1]}`
        : new Date(startDate).toISOString()
      : '';

    onApply(
      selectedLocations.map((loc) => loc.value),
      formattedStartDate,
      hourlyPay,
    );
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
          onClick={() => setIsFilterOpen(false)}
        />
      </div>
      <p className={styles.filterName}>위치</p>
      <div className={styles.filterLocation}>
        {sortedAddressOptions.map((option) => (
          <div
            key={option.value}
            className={styles.locationOption}
            onClick={() => handleLocationClick(option)}
          >
            {option.value}
          </div>
        ))}
      </div>
      <div className={styles.selectedTags}>
        {selectedLocations.map((location) => (
          <div key={location.value} className={styles.tag}>
            {location.value}
            <span
              className={styles.tagClose}
              onClick={() => handleTagRemove(location.value)}
            >
              ×
            </span>
          </div>
        ))}
      </div>

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
          value={hourlyPay}
          placeholder="입력"
          inputMode="numeric"
          pattern="[0-9]*"
          className={styles.filterPrice}
          onChange={handleHourlyPayChange}
        />
        <p className={styles.filterPriceText}>원</p>
        <p className={styles.filterName}>이상부터</p>
      </div>
      <div className={styles.filterBottom}>
        <button className={styles.buttonReset} onClick={handleResetClick}>
          초기화
        </button>
        <button className={styles.submit} onClick={handleApplyClick}>
          적용하기
        </button>
      </div>
    </div>
  );
};
export default FilterDropdown;
