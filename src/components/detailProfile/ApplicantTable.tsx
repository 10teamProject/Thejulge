import Image from 'next/image';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Pagination } from '@/components/common/PageNation';
import fetchAPI from '@/pages/api/AxiosInstance';
import styles from './ApplicantTable.module.scss';

import pendingImage from '@/public/assets/icon/pending.svg';
import applyImage from '@/public/assets/icon/apply.svg';
import rejectionImage from '@/public/assets/icon/rejection.svg';

interface ApplicantTableProps {
  user_id: string;
}

// 예시로 취소된 상태 추가
type ApplicationStatus = 'accepted' | 'rejected' | 'canceled';

interface Application {
  id: string;
  status: ApplicationStatus;
  createdAt: string;
}

interface ApiResponse {
  item: Application;
  links: [];
}

const ApplicantTable: React.FC<ApplicantTableProps> = ({ user_id }) => {
  const [currentPage, setCurrentPage] = useState(1); // 페이지는 1부터 시작
  const [list, setList] = useState<Application[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const rowPerPage = 5;

  const loadList = async (pageNumber: number) => {
    const token = Cookies.get('token');

    const { data } = await fetchAPI().get(`/users/${user_id}/applications`, {
      params: {
        offset: (pageNumber - 1) * rowPerPage, // 페이지 번호에 따라 오프셋 계산
        limit: rowPerPage,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  };

  const fetchData = async (page: number) => {
    try {
      const res = await loadList(page);

      setCurrentPage(page); // 현재 페이지 설정
      // 취소된 데이터를 제외한 리스트 설정
      const filteredList = res.items.filter((item) => item.item.status !== 'canceled');
      setList(filteredList);
      setTotalPages(Math.ceil(res.count / rowPerPage));
    } catch (error) {
      console.error('Error fetching applicants:', error);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const formatDate = (startsAt: string, workhour: number) => {
    const startDate = new Date(startsAt);

    // 로컬 시간으로 변환
    const localStartDate = new Date(startDate.getTime() + (startDate.getTimezoneOffset() * 60000));
    const endDate = new Date(localStartDate.getTime() + (workhour * 60 * 60 * 1000));

    const formatHour = (hour: number) => hour.toString().padStart(2, '0');
    const formatMinute = (minute: number) => minute.toString().padStart(2, '0');

    const formattedStart = `${localStartDate.getFullYear()}-${formatHour(localStartDate.getMonth() + 1)}-${formatHour(localStartDate.getDate())} ${formatHour(localStartDate.getHours())}:${formatMinute(localStartDate.getMinutes())}`;

    const formattedEnd = `${formatHour(endDate.getHours())}:${formatMinute(endDate.getMinutes())}`;

    const duration = `${workhour}시간`;

    return `${formattedStart} ~ ${formattedEnd} (${duration})`;
  };

  const getStatusImage = (status: string) => {
    switch (status) {
      case 'pending':
        return pendingImage.src;
      case 'accepted':
        return applyImage.src;
      case 'rejected':
        return rejectionImage.src;
      default:
        return null; 
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableTitle}>신청 내역</div>
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
          {list.map((tItem, idx) => {
            const { shop, notice, status } = tItem.item;

            let imageWidth = 46;
            let imageHeight = 29;

            if (status === 'pending') {
              imageWidth = 59;
              imageHeight = 29;
            } else if (status === 'accepted') {
              imageWidth = 75;
              imageHeight = 29;
            }

            return (
              <tr key={idx}>
                <td>{shop.item.name}</td>
                <td>{formatDate(notice.item.startsAt, notice.item.workhour)}</td>
                <td>{notice.item.hourlyPay}</td>
                <td>
                  <div className={styles.statusImage}>
                    <Image
                      src={getStatusImage(status)}
                      alt={status}
                      width={imageWidth}
                      height={imageHeight}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={styles.pageNationWrap}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default ApplicantTable;
