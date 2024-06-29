import React from 'react';

import { Item } from '@/pages/api/GetApplitcantList';

import styles from './ApplicantList.module.scss';

interface ApplicantRowProps {
  applicant: Item;
  onStatusChange: (id: string, newStatus: 'accepted' | 'rejected') => void;
}

export const ApplicantRow: React.FC<ApplicantRowProps> = ({
  applicant,
  onStatusChange,
}) => (
  <tr>
    <td>{applicant.user.item.name}</td>
    <td className={styles.introText}>{applicant.user.item.bio}</td>
    <td>{applicant.user.item.phone}</td>
    <td className={styles.statusCell}>
      {applicant.status === 'pending' ? (
        <>
          <button
            className={`${styles.button} ${styles.reject}`}
            onClick={() => onStatusChange(applicant.id, 'rejected')}
          >
            거절하기
          </button>
          <button
            className={`${styles.button} ${styles.approve}`}
            onClick={() => onStatusChange(applicant.id, 'accepted')}
          >
            승인하기
          </button>
        </>
      ) : (
        <span className={`${styles.statusBadge} ${styles[applicant.status]}`}>
          {applicant.status === 'rejected' ? '거절' : '승인 완료'}
        </span>
      )}
    </td>
  </tr>
);
