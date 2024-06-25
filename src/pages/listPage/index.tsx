import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';

import FilterDropdown from '@/components/listPage/FilterDropdown';
import NoticeCard from '@/components/listPage/NoticeCard';
import { Notice, NoticeResponse } from '@/utils/NoticeCard/NoticesType';
import paginationStyles from '@/utils/Pagination.module.scss';

import { instance } from '../api/AxiosInstance';
import styles from './ListPage.module.scss';

type Props = {
  initialNotices: Notice[];
  totalCount: number;
  currentPage: number;
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const currentPage = context.query.page
    ? parseInt(context.query.page as string, 10)
    : 1;
  const limit = 6;
  const offset = (currentPage - 1) * limit;

  try {
    const response = await instance.get<NoticeResponse>('/notices', {
      params: {
        offset,
        limit,
      },
    });
    const initialNotices: Notice[] = response.data.items.map(
      (item) => item.item,
    );
    const totalCount = response.data.count;

    return {
      props: {
        initialNotices,
        totalCount,
        currentPage,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        initialNotices: [],
        totalCount: 0,
        currentPage,
      },
    };
  }
};

const ListPage: React.FC<Props> = ({
  initialNotices,
  totalCount,
  currentPage,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [label, setLabel] = useState('마감임박순');
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [page, setPage] = useState(currentPage);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchNotices = async (page: number) => {
      const offset = (page - 1) * itemsPerPage;
      try {
        const response = await instance.get<NoticeResponse>('/notices', {
          params: {
            offset,
            limit: itemsPerPage,
          },
        });
        setNotices(response.data.items.map((item) => item.item));
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotices(page);
  }, [page]);

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

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  return (
    <>
      <div className={styles.customContainer}>
        <div className={styles.customSection}>
          <h2 className={styles.title}>맞춤 공고</h2>
          <div className={styles.fitNotice}>
            {initialNotices.map((notice) => (
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
        <div className={styles.notices}>
          {notices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>
        <Pagination
          activePage={page}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={totalCount}
          pageRangeDisplayed={7}
          onChange={handlePageChange}
          innerClass={paginationStyles.pagination}
          itemClass={paginationStyles['page-item']}
          linkClass={paginationStyles['page-link']}
          activeClass={paginationStyles.active}
        />
      </div>
    </>
  );
};

export default ListPage;
