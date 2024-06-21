import { useState } from 'react';
import styles from './ListPage.module.css';

const ListPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState('마감임박순');

  const sortOptions = [
    { key: 'time', label: '마감임박순' },
    { key: 'pay', label: '시급많은순' },
    { key: 'hour', label: '시간적은순' },
    { key: 'shop', label: '가나다순' },
  ];

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setIsDropdownOpen(false);
  };
  return (
    <>
      <div className={styles.customContainer}>
        <div className={styles.customSection}>
          <h2 className={styles.title}>맞춤 공고</h2>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>전체 공고</h2>
          <div
            className={styles.sortDropdown}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            마감임박순 ▼
            {isDropdownOpen && (
              <ul className={styles.sortDropdownMenu}>
                {sortOptions.map((option) => (
                  <li
                    key={option.key}
                    className={`${styles.sortDropdownText} ${styles.dropdownLine}`}
                    onClick={() => handleSortChange(option.key)}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.detailFilter}>상세 필터</div>
        </div>
      </div>
    </>
  );
};
export default ListPage;
