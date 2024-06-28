import React from 'react';

import styles from '@/components/myStore/ApplicantList.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => (
  <div className={styles.pagination}>
    <button
      className={styles.pageButton}
      onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
      disabled={currentPage === 1}
    >
      {'<'}
    </button>
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
        onClick={() => onPageChange(page)}
      >
        {page}
      </button>
    ))}
    <button
      className={styles.pageButton}
      onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
      disabled={currentPage === totalPages}
    >
      {'>'}
    </button>
  </div>
);
