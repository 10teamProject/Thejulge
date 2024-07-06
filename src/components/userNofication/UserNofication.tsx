import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import Modal from '@/components/common/ConfirmModal';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { getUserAlerts, readAlert } from '@/pages/api/GetMyAlert';
import notificationActiveIcon from '@/public/assets/icon/nofication-active.svg';
import notificationIcon from '@/public/assets/icon/notification.svg';
import checkIcon from '@/public/assets/icon/check_Icon.svg';
import { formatDate, formatTimeAgo } from '@/utils/DateUtile';

import styles from './UserNofication.module.scss';

interface AlertItem {
  id: string;
  createdAt: string;
  result: 'accepted' | 'rejected' | null;
  read: boolean;
  application: {
    item: {
      id: string;
      status: 'pending' | 'accepted' | 'rejected';
    };
    href: string;
  };
  shop: {
    item: {
      name: string;
    };
  };
  notice: {
    item: {
      startsAt: string;
    };
  };
}

interface AlertResponse {
  items: { item: AlertItem }[];
  count: number;
}

const UserNotification: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [userType, setUserType] = useState<'employee' | 'employer' | null>(
    null,
  );

  useEffect(() => {
    const userString = sessionStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setUserType(user.type);
    }
  }, []);

  const fetchAlerts = async () => {
    if (!userType) return;

    try {
      const response: AlertResponse = await getUserAlerts(0, 7);
      let filteredAlerts: AlertItem[];
      if (userType === 'employee') {
        filteredAlerts = response.items
          .map((item) => item.item)
          .filter(
            (item) => item.result === 'accepted' || item.result === 'rejected',
          );
      } else {
        filteredAlerts = response.items
          .map((item) => item.item)
          .filter((item) => item.application.item.status === 'pending');
      }

      setAlerts(filteredAlerts);
      const newUnreadCount = filteredAlerts.filter((item) => !item.read).length;
      setUnreadCount(newUnreadCount);

      const storedAlerts = JSON.parse(
        sessionStorage.getItem('processedAlerts') || '[]',
      );
      const newAlerts = filteredAlerts.filter(
        (alert) => !storedAlerts.includes(alert.id),
      );

      if (newAlerts.length > 0) {
        setIsModalOpen(true);
        sessionStorage.setItem(
          'processedAlerts',
          JSON.stringify([
            ...storedAlerts,
            ...newAlerts.map((alert) => alert.id),
          ]),
        );
      }
    } catch (error) {
      console.error('알림을 가져오는데 실패했습니다:', error);
    }
  };

  useEffect(() => {
    if (userType) {
      fetchAlerts();

      const intervalId = setInterval(() => {
        fetchAlerts();
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [userType]);

  const handleClose = useCallback(() => setIsOpen(false), []);
  useOutsideClick(modalRef, buttonRef, handleClose);

  const toggleNotification = () => {
    setIsOpen(!isOpen);
  };

  const handleReadAlert = async (alertId: string) => {
    try {
      await readAlert(alertId);
      fetchAlerts();
    } catch (error) {
      console.error('알림 읽기 오류:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    closeModal();
    setIsOpen(true);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return '승인';
      case 'rejected':
        return '거절';
      case 'pending':
        return '대기 중';
      default:
        return '';
    }
  };

  const getAlertMessage = (alert: AlertItem) => {
    if (userType === 'employee') {
      const statusText = getStatusText(alert.result || '');
      const statusClass =
        alert.result === 'accepted' ? styles.acceptedText : styles.rejectedText;
      return (
        <span>
          {alert.shop.item.name}({formatDate(alert.notice.item.startsAt)}) 공고
          지원이 <span className={statusClass}>{statusText}</span>
          되었어요.
        </span>
      );
    } else if (userType === 'employer') {
      return (
        <span>
          {alert.shop.item.name}({formatDate(alert.notice.item.startsAt)})
          공고에 <span className={styles.pendingText}>새로운 지원자</span>가
          있습니다.
        </span>
      );
    }
    return null;
  };

  return (
    <div className={styles.notificationContainer}>
      <button
        ref={buttonRef}
        onClick={toggleNotification}
        className={styles.notificationButton}
      >
        <Image
          src={unreadCount > 0 ? notificationActiveIcon : notificationIcon}
          alt="알림 아이콘"
          width={24}
          height={24}
        />
        {unreadCount > 0 && (
          <span className={styles.unreadBadge}>{unreadCount}</span>
        )}
      </button>
      {isOpen && (
        <div ref={modalRef} className={styles.notificationModal}>
          <h3>알림 {alerts.length}개</h3>
          <ul className={styles.alertList}>
            {alerts.map((alert) => (
              <li
                key={alert.id}
                className={`${styles.alertItem} ${alert.read ? styles.readAlert : ''}`}
                onClick={() => handleReadAlert(alert.id)}
              >
                <span
                  className={`${styles.dot} ${
                    userType === 'employee'
                      ? alert.result === 'accepted'
                        ? styles.accepted
                        : styles.rejected
                      : styles.pending
                  }`}
                />
                <div className={styles.alertContent}>
                  <p className={styles.alertText}>{getAlertMessage(alert)}</p>
                  <span className={styles.time}>
                    {formatTimeAgo(alert.createdAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        icon={
          <Image src={checkIcon} alt="체크 아이콘" width={24} height={24} />
        }
        message={
          userType === 'employee'
            ? '지원한 공고에 대한 응답이 도착했습니다.'
            : '새로운 지원자가 있습니다.'
        }
        buttons={[
          {
            text: '알림 확인',
            onClick: handleConfirm,
            variant: 'primary',
          },
        ]}
      />
    </div>
  );
};

export default UserNotification;
