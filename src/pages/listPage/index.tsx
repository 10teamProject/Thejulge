import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';

import FilterDropdown from '@/components/listPage/FilterDropdown';
import NoticeCard from '@/components/listPage/NoticeCard';
import { Notice } from '@/utils/NoticeCard/NoticesType';
import paginationStyles from '@/utils/Pagination.module.scss';

import { getNotices } from '../api/GetNotice';
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

  const params = {
    offset,
    limit,
    // 추가로 필요한 파라미터들 여기에 추가
  };

  try {
    const data = await getNotices(params);
    const initialNotices: Notice[] = data.items.map((item) => item.item);
    const totalCount = data.count;

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

  const [sort, setSort] = useState<'time' | 'pay' | 'hour' | 'shop'>('time');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [hourlyPay, setHourlyPay] = useState(0);

  useEffect(() => {
    const fetchNotices = async (
      page: number,
      sort: 'time' | 'pay' | 'hour' | 'shop',
      locations: string[],
      startDate: string,
      hourlyPay: number,
    ) => {
      const offset = (page - 1) * itemsPerPage;

      const params = {
        offset,
        limit: itemsPerPage,
        sort,
        address: locations,
        startsAtGte: startDate,
        hourlyPayGte: hourlyPay,
      };

      try {
        const data = await getNotices(params);
        setNotices(data.items.map((item) => item.item));
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotices(page, sort, selectedLocations, startDate, hourlyPay);
  }, [page, sort, selectedLocations, startDate, hourlyPay]);

  const sortOptions: {
    key: 'time' | 'pay' | 'hour' | 'shop';
    label: string;
  }[] = [
    { key: 'time', label: '마감임박순' },
    { key: 'pay', label: '시급많은순' },
    { key: 'hour', label: '시간적은순' },
    { key: 'shop', label: '가나다순' },
  ];

  const handleSortChange = (
    newSortBy: 'time' | 'pay' | 'hour' | 'shop',
    newLabel: string,
  ) => {
    setSort(newSortBy);
    setLabel(newLabel);
    setIsDropdownOpen(false);
  };

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };
  const handleFilterApply = (
    locations: string[],
    startDate: string,
    hourlyPay: number,
  ) => {
    setSelectedLocations(locations);
    setStartDate(startDate);
    setHourlyPay(hourlyPay);
    setIsFilterOpen(false);
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
              <FilterDropdown
                setIsFilterOpen={setIsFilterOpen}
                onApply={handleFilterApply}
                initialSelectedLocations={selectedLocations}
                initialStartDate={startDate}
                initialHourlyPay={hourlyPay}
              />
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
