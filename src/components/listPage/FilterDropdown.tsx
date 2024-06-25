import { useEffect, useState, ChangeEvent } from 'react';
import styles from './FilterDropdown.module.scss';
import Image from 'next/image';
import X from '@/public/assets/images/black_x.png';

const addressOptions = [
  { value: 'Jongno-gu', label: '서울시 종로구' },
  { value: 'Jung-gu', label: '서울시 중구' },
  { value: 'Yongsan-gu', label: '서울시 용산구' },
  { value: 'Seongdong-gu', label: '서울시 성동구' },
  { value: 'Gwangjin-gu', label: '서울시 광진구' },
  { value: 'Dongdaemun-gu', label: '서울시 동대문구' },
  { value: 'Jungnang-gu', label: '서울시 중랑구' },
  { value: 'Seongbuk-gu', label: '서울시 성북구' },
  { value: 'Gangbuk-gu', label: '서울시 강북구' },
  { value: 'Dobong-gu', label: '서울시 도봉구' },
  { value: 'Nowon-gu', label: '서울시 노원구' },
  { value: 'Eunpyeong-gu', label: '서울시 은평구' },
  { value: 'Seodaemun-gu', label: '서울시 서대문구' },
  { value: 'Mapo-gu', label: '서울시 마포구' },
  { value: 'Yangcheon-gu', label: '서울시 양천구' },
  { value: 'Gangseo-gu', label: '서울시 강서구' },
  { value: 'Guro-gu', label: '서울시 구로구' },
  { value: 'Geumcheon-gu', label: '서울시 금천구' },
  { value: 'Yeongdeungpo-gu', label: '서울시 영등포구' },
  { value: 'Dongjak-gu', label: '서울시 동작구' },
  { value: 'Gwanak-gu', label: '서울시 관악구' },
  { value: 'Seocho-gu', label: '서울시 서초구' },
  { value: 'Gangnam-gu', label: '서울시 강남구' },
  { value: 'Songpa-gu', label: '서울시 송파구' },
  { value: 'Gangdong-gu', label: '서울시 강동구' },
];

const sortedAddressOptions = addressOptions.sort((a, b) => {
  return a.label.localeCompare(b.label, 'ko');
});

interface FilterDropdownProps {
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ setIsFilterOpen }) => {
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
  }, []);

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
        ></input>
        <p className={styles.filterPriceText}>원</p>
        <p className={styles.filterName}>이상부터</p>
      </div>
      <div className={styles.filterBottom}>
        <button className={styles.buttonReset}>초기화</button>
        <button className={styles.submit}>적용하기</button>
      </div>
    </div>
  );
};
export default FilterDropdown;
