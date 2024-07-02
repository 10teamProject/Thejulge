import { useRouter } from 'next/router';
import React, { useState } from 'react';

import styles from './Search.module.scss';
const Search: React.FC = () => {
  const router = useRouter();

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const keyword = (event.target as HTMLInputElement).value;
      router.push(`/listPage?keyword=${encodeURIComponent(keyword)}`);
    }
  };
  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="가게 이름으로 찾아보세요"
        onKeyPress={handleSearch}
      />
    </div>
  );
};
export default Search;
