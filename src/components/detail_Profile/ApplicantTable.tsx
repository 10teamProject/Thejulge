import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';

import { Pagination } from '@/components/common/PageNation';
import fetchAPI from '@/pages/api/AxiosInstance';

import styles from './ApplicantTable.module.scss';

interface ApplicantTableProps {
  user_id: string;
}

const ApplicantTable: React.FC<ApplicantTableProps> = ({
  user_id
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [list, setList] = useState([])
  const [totalPages, setTotalPages] = useState(0)

  const rowPerPage = 5;

  const loadList = async (pageNumber: number) => {
    console.log(pageNumber)
    const token = Cookies.get('token');

    const {data} = await fetchAPI().get(`/users/${user_id}/applications`, {
      params: {
        offset: (pageNumber - 1),
        limit: rowPerPage,
      }
    })

    return data
  }

  const fetchData = async (page: number) => {
    try {
      const res = await loadList(1)

      setCurrentPage(res.offset + 1); // 현재 페이지 set = data.offset + 1 (offset은 index, 사용자 표시 숫자 = idx + 1)
      setList(res.items);
      setTotalPages(Math.ceil(res.count / rowPerPage))
    } catch (error) {
      console.error('Error fetching applicants:', error);
    } 
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>가게</th>
            <th>일자</th>
            <th>시급</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {
            list.map((tItem, idx) => {
              const {shop, notice} = tItem.item

              return <>
                <tr key={idx}>
                  <td>{shop.item.name}</td>
                  <td>{notice.item.startsAt}</td>
                  <td>{notice.item.hourlyPay}</td>
                  <td>{notice.item.closed === false ? '신청완료' : '거절'}</td>
                </tr>
              </>
            })
          }
        </tbody>
      </table>
      <div className={styles.pageNationWrap}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={loadList}
        />
      </div>
    </div>
  );
};

export default ApplicantTable;

