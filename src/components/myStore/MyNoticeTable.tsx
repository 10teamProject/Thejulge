import React from 'react';

import CommonTable, { Column } from '@/components/common/CommonTable';
import styles from '@/components/common/CommonTable.module.scss';
import { useApplicants } from '@/hooks/useApplicants';
import { Item } from '@/pages/api/GetApplitcantList';

interface SecondTableProps {
  shop_id: string;
  notice_id: string;
}

export default function SecondTable({ shop_id, notice_id }: SecondTableProps) {
  const {
    applicants,
    currentPage,
    totalPages,
    setCurrentPage,
    handleStatusChange,
  } = useApplicants(shop_id, notice_id);

  const columns: Column<Item>[] = [
    {
      key: 'user',
      header: '신청자',
      render: (item) => item.user.item.name || 'Unknown',
    },
    {
      key: 'user',
      header: '소개',
      render: (item) => item.user.item.bio || 'No introduction',
    },
    {
      key: 'user',
      header: '전화번호',
      render: (item) => item.user.item.phone || 'No phone number',
    },
    {
      key: 'status',
      header: '상태',
      render: (item) => (
        <div className={styles.statusCell}>
          {item.status === 'pending' ? (
            <>
              <button
                className={`${styles.button} ${styles.reject}`}
                onClick={() => handleStatusChange(item.id, 'rejected')}
              >
                거절하기
              </button>
              <button
                className={`${styles.button} ${styles.approve}`}
                onClick={() => handleStatusChange(item.id, 'accepted')}
              >
                승인하기
              </button>
            </>
          ) : (
            <span className={`${styles.statusBadge} ${styles[item.status]}`}>
              {item.status === 'rejected'
                ? '거절됨'
                : item.status === 'canceled'
                  ? '취소됨'
                  : '승인됨'}
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <CommonTable
      data={applicants}
      columns={columns}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      onStatusChange={handleStatusChange}
    />
  );
}
