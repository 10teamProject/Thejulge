import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { Pagination } from '@/components/common/PageNation';
import fetchAPI from '@/pages/api/AxiosInstance';
import styles from './ApplicantTable.module.scss';
import { updateApplicationStatus } from '@/pages/api/ApplicationStatus';

interface ApplicantTableProps {
  user_id: string;
}

type ApplicationStatus = 'accepted' | 'rejected' | 'canceled' | 'pending';

interface Shop {
  item: {
    id: string;
    name: string;
  };
}

interface Notice {
  item: {
    id: string;
    startsAt: string;
    workhour: number;
    hourlyPay: number;
  };
}

interface Application {
  id: string;
  status: ApplicationStatus;
  createdAt: string;
  shop: Shop;
  notice: Notice;
}

interface ApiResponseItem {
  item: Application;
}

interface ApiResponse {
  items: ApiResponseItem[];
  count: number;
}

const ApplicantTable: React.FC<ApplicantTableProps> = ({ user_id }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [list, setList] = useState<ApiResponseItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const rowPerPage = 5;

  const loadList = async (
    offset: number,
    limit: number,
  ): Promise<ApiResponse> => {
    const token = Cookies.get('token');

    const { data } = await fetchAPI().get(`/users/${user_id}/applications`, {
      params: {
        offset,
        limit,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  };

  const fetchData = async (page: number) => {
    try {
      let currentOffset = (page - 1) * rowPerPage;
      let currentLimit = rowPerPage;
      let aggregatedList: ApiResponseItem[] = [];
      let totalItems = 0;

      while (aggregatedList.length < rowPerPage) {
        const res = await loadList(currentOffset, currentLimit);
        totalItems = res.count;
        aggregatedList = [...aggregatedList, ...res.items];

        if (res.items.length < currentLimit) {
          break;
        }

        currentOffset += currentLimit;
        currentLimit = rowPerPage - aggregatedList.length;
      }

      setCurrentPage(page);
      setList(aggregatedList.slice(0, rowPerPage));
      setTotalPages(Math.ceil(totalItems / rowPerPage));
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
    const localStartDate = new Date(
      startDate.getTime() + startDate.getTimezoneOffset() * 60000,
    );
    const endDate = new Date(
      localStartDate.getTime() + workhour * 60 * 60 * 1000,
    );

    const formatHour = (hour: number) => hour.toString().padStart(2, '0');
    const formatMinute = (minute: number) => minute.toString().padStart(2, '0');

    const formattedStart = `${localStartDate.getFullYear()}-${formatHour(localStartDate.getMonth() + 1)}-${formatHour(localStartDate.getDate())} ${formatHour(localStartDate.getHours())}:${formatMinute(localStartDate.getMinutes())}`;

    const formattedEnd = `${formatHour(endDate.getHours())}:${formatMinute(endDate.getMinutes())}`;

    const duration = `${workhour}시간`;

    return `${formattedStart} ~ ${formattedEnd} (${duration})`;
  };

  const formatCurrency = (number: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(number);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <div className={`${styles.statusBadge} ${styles.pending}`}>
            대기중
          </div>
        );
      case 'accepted':
        return (
          <div className={`${styles.statusBadge} ${styles.accepted}`}>
            승인완료
          </div>
        );
      case 'rejected':
        return (
          <div className={`${styles.statusBadge} ${styles.rejected}`}>
            거절됨
          </div>
        );
      case 'canceled':
        return (
          <div className={`${styles.statusBadge} ${styles.canceled}`}>
            취소됨
          </div>
        );
      default:
        return null;
    }
  };

  const handleCancelApplication = async (
    shopId: string,
    noticeId: string,
    applicationId: string,
  ) => {
    try {
      await updateApplicationStatus(
        shopId,
        noticeId,
        applicationId,
        'canceled',
      );
      fetchData(currentPage); // 취소 후 현재 페이지 목록 갱신
    } catch (error) {
      console.error('Error canceling application:', error);
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
            const { id, shop, notice, status } = tItem.item;

            return (
              <tr key={idx}>
                <td>{shop.item.name}</td>
                <td>
                  {formatDate(notice.item.startsAt, notice.item.workhour)}
                </td>
                <td>{formatCurrency(notice.item.hourlyPay)}</td>
                <td>
                  <div className={styles.statusCell}>
                    {getStatusBadge(status)}
                    {status === 'pending' && (
                      <button
                        className={styles.cancelButton}
                        onClick={() =>
                          handleCancelApplication(
                            shop.item.id,
                            notice.item.id,
                            id,
                          )
                        }
                      >
                        취소
                      </button>
                    )}
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
