import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';

import X from '@/public/assets/images/black_x.png';

import styles from './FilterDropdown.module.scss';

const addressOptions = [
  { value: '서울시 종로구', label: '서울시 종로구' },
  { value: '서울시 중구', label: '서울시 중구' },
  { value: '서울시 용산구', label: '서울시 용산구' },
  { value: '서울시 성동구', label: '서울시 성동구' },
  { value: '서울시 광진구', label: '서울시 광진구' },
  { value: '서울시 동대문구', label: '서울시 동대문구' },
  { value: '서울시 중랑구', label: '서울시 중랑구' },
  { value: '서울시 성북구', label: '서울시 성북구' },
  { value: '서울시 강북구', label: '서울시 강북구' },
  { value: '서울시 도봉구', label: '서울시 도봉구' },
  { value: '서울시 노원구', label: '서울시 노원구' },
  { value: '서울시 은평구', label: '서울시 은평구' },
  { value: '서울시 서대문구', label: '서울시 서대문구' },
  { value: '서울시 마포구', label: '서울시 마포구' },
  { value: '서울시 양천구', label: '서울시 양천구' },
  { value: '서울시 강서구', label: '서울시 강서구' },
  { value: '서울시 구로구', label: '서울시 구로구' },
  { value: '서울시 금천구', label: '서울시 금천구' },
  { value: '서울시 영등포구', label: '서울시 영등포구' },
  { value: '서울시 동작구', label: '서울시 동작구' },
  { value: '서울시 관악구', label: '서울시 관악구' },
  { value: '서울시 서초구', label: '서울시 서초구' },
  { value: '서울시 강남구', label: '서울시 강남구' },
  { value: '서울시 송파구', label: '서울시 송파구' },
  { value: '서울시 강동구', label: '서울시 강동구' },
];

const sortedAddressOptions = addressOptions.sort((a, b) => {
  return a.label.localeCompare(b.label, 'ko');
});

interface FilterDropdownProps {
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onApply: (locations: string[]) => void;
  initialSelectedLocations: string[];
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  setIsFilterOpen,
  onApply,
  initialSelectedLocations,
}) => {
  const [minDate, setMinDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMinDate(today);
    setStartDate(today);
    setSelectedLocations(
      initialSelectedLocations.map((location) => ({
        value: location,
        label: location,
      })),
    );
  }, [initialSelectedLocations]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value;
    setStartDate(selectedDate);
  };

  const handleLocationClick = (location: { value: string; label: string }) => {
    if (!selectedLocations.find((loc) => loc.value === location.value)) {
      setSelectedLocations([...selectedLocations, location]);
    }
  };

  const handleTagRemove = (value: string) => {
    setSelectedLocations(
      selectedLocations.filter((loc) => loc.value !== value),
    );
  };

  const handleFilterPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      setFilterPrice(newValue);
    }
  };

  const handleApplyClick = () => {
    onApply(selectedLocations.map((loc) => loc.value)); // 선택된 주소 전달
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
            {option.label}
          </div>
        ))}
      </div>
      <div className={styles.selectedTags}>
        {selectedLocations.map((location) => (
          <div key={location.value} className={styles.tag}>
            {location.label}
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
          value={filterPrice}
          placeholder="입력"
          className={styles.filterPrice}
          onChange={handleFilterPriceChange}
        />
        <p className={styles.filterPriceText}>원</p>
        <p className={styles.filterName}>이상부터</p>
      </div>
      <div className={styles.filterBottom}>
        <button className={styles.buttonReset}>초기화</button>
        <button className={styles.submit} onClick={handleApplyClick}>
          적용하기
        </button>
      </div>
    </div>
  );
};
export default FilterDropdown;
