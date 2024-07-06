import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import Pagination from 'react-js-pagination';

import FilterDropdown from '@/components/listPage/FilterDropdown';
import FitNotice from '@/components/listPage/FitNotice';
import NoticeCard from '@/components/listPage/NoticeCard';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { Notice } from '@/utils/NoticeCard/NoticesType';
import paginationStyles from '@/utils/Pagination.module.scss';

import { getNotices } from '../api/GetNotice';
import styles from './ListPage.module.scss';
type Props = {
  initialNotices: Notice[];
  totalCount: number;
  currentPage: number;
  sort: 'time' | 'pay' | 'hour' | 'shop';
  keyword?: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const { query } = context;
  const currentPage = query.page ? parseInt(query.page as string, 10) : 1;
  const keyword = query.keyword as string;

  try {
    const sort =
      query.sort &&
      ['time', 'pay', 'hour', 'shop'].includes(query.sort as string)
        ? (query.sort as 'time' | 'pay' | 'hour' | 'shop')
        : 'pay';

    const params = {
      ...query, // Include any other query parameters for filtering
      sort,
      page: currentPage, // Ensure correct pagination
    };

    const data = await getNotices(params);
    const allNotices: Notice[] = data.items.map((item) => item.item);
    const totalCount = data.count;

    const initialNotices = allNotices.filter((notice) => {
      const isExpired = new Date(notice.startsAt) < new Date();
      return !notice.closed && !isExpired;
    });

    return {
      props: {
        initialNotices,
        totalCount,
        currentPage,
        sort,
        keyword: keyword || '',
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        initialNotices: [],
        totalCount: 0,
        currentPage,
        sort: 'time',
        keyword: keyword || '',
      },
    };
  }
};

const ListPage: React.FC<Props> = ({
  initialNotices,
  totalCount,
  currentPage,
  sort: initialSort,
  keyword,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [label, setLabel] = useState('마감임박순');
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [page, setPage] = useState(currentPage);
  const itemsPerPage = 6;
  const [totalNoticesCount, setTotalNoticesCount] = useState(totalCount);

  const [sort, setSort] = useState<'time' | 'pay' | 'hour' | 'shop'>('time');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [hourlyPay, setHourlyPay] = useState(0);
  const [filterCount, setFilterCount] = useState(0);

  const filterRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLDivElement>(null); // 버튼에 대한 참조 생성

  // useOutsideClick 훅 사용
  useOutsideClick(filterRef, filterButtonRef, () => {
    setIsFilterOpen(false);
    setFilterCount(0);
  });

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
        keyword,
      };

      try {
        const data = await getNotices(params);
        setNotices(data.items.map((item) => item.item));
        setTotalNoticesCount(data.count); // 총 개수 계산
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotices(page, sort, selectedLocations, startDate, hourlyPay);
  }, [page, sort, selectedLocations, startDate, hourlyPay, keyword]);

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
    setPage(1);
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
    setPage(1);
  };

  const handleFilterCountChange = (count: number) => {
    setFilterCount(count);
  };

  return (
    <>
      {!keyword && <FitNotice initialNotices={initialNotices} />}

      <div className={styles.container}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>
            {keyword ? (
              <>
                <span className={styles.keyword}>{keyword}</span> 에 대한 공고
                목록
              </>
            ) : (
              '전체 공고'
            )}
          </h2>
          <div className={styles.dropdownGroup}>
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
              ref={filterButtonRef}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              상세 필터 {filterCount > 0 && `(${filterCount})`}
              {isFilterOpen && (
                <div ref={filterRef}>
                  <FilterDropdown
                    setIsFilterOpen={setIsFilterOpen}
                    onApply={handleFilterApply}
                    initialSelectedLocations={selectedLocations}
                    initialStartDate={startDate}
                    initialHourlyPay={hourlyPay}
                    onFilterCountChange={handleFilterCountChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.notices}>
          {notices.length > 0 ? (
            notices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))
          ) : (
            <p className={styles.noNoticesMessage}>공고가 없습니다</p>
          )}
        </div>
        <Pagination
          activePage={page}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={totalNoticesCount}
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
