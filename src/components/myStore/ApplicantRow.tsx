import Image from 'next/image';
import { useState } from 'react';

import Modal from '@/components/common/ConfirmModal';
import { Item } from '@/pages/api/GetApplitcantList';
import Checkicon from '@/public/assets/icon/check_Icon.svg';

import styles from './ApplicantList.module.scss';

interface ApplicantRowProps {
  applicant: Item;
  onStatusChange: (
    id: string,
    newStatus: 'accepted' | 'rejected' | 'canceled',
  ) => void;
}

export const ApplicantRow: React.FC<ApplicantRowProps> = ({
  applicant,
  onStatusChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    'accepted' | 'rejected' | 'canceled' | null
  >(null);

  const handleActionClick = (action: 'accepted' | 'rejected' | 'canceled') => {
    setPendingAction(action);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (pendingAction) {
      onStatusChange(applicant.id, pendingAction);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <tr>
        <td>{applicant.user.item.name}</td>
        <td className={styles.introText}>{applicant.user.item.bio}</td>
        <td>{applicant.user.item.phone}</td>
        <td className={styles.statusCell}>
          {applicant.status === 'pending' ? (
            <>
              <button
                className={`${styles.button} ${styles.reject}`}
                onClick={() => handleActionClick('rejected')}
              >
                거절하기
              </button>
              <button
                className={`${styles.button} ${styles.approve}`}
                onClick={() => handleActionClick('accepted')}
              >
                승인하기
              </button>
            </>
          ) : (
            <span
              className={`${styles.statusBadge} ${styles[applicant.status]}`}
            >
              {applicant.status === 'rejected'
                ? '거절됨'
                : applicant.status === 'canceled'
                  ? '취소됨'
                  : '승인됨'}
            </span>
          )}
        </td>
      </tr>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        icon={
          <Image
            src={Checkicon}
            alt="Check Icon"
            className={styles.modalIcon}
            width={24}
            height={24}
          />
        }
        message={`신청을 ${pendingAction === 'accepted' ? '승인' : pendingAction === 'rejected' ? '거절' : '취소'}하시겠어요?`}
        buttons={[
          {
            text: '아니오',
            onClick: handleCancel,
            variant: 'secondary',
          },
          {
            text: '예',
            onClick: handleConfirm,
            variant: 'primary',
          },
        ]}
      />
    </>
  );
};
