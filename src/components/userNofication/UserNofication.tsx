import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import Modal from '@/components/auth/ErrorModal';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { getUserAlerts, readAlert } from '@/pages/api/GetMyAlert';
import notificationActiveIcon from '@/public/assets/icon/nofication-active.svg';
import notificationIcon from '@/public/assets/icon/notification.svg';
import { AlertItem, AlertResponse } from '@/types/notificationType';
import { formatDate, formatTimeAgo } from '@/utils/DateUtile';

import styles from './UserNofication.module.scss';

const UserNotification: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const fetchAlerts = async () => {
    try {
      const response: AlertResponse = await getUserAlerts(0, 10);
      const alertItems = response.items.map((item) => item.item);
      setAlerts(alertItems);
      const newUnreadCount = alertItems.filter((item) => !item.read).length;
      setUnreadCount(newUnreadCount);

      const totalCount = response.count; // 전체 알림 개수
      const storedCount = sessionStorage.getItem('totalNotificationCount');
      if (storedCount !== null) {
        const prevCount = parseInt(storedCount, 10);
        if (totalCount > prevCount) {
          setIsModalOpen(true);
        }
      }
      sessionStorage.setItem('totalNotificationCount', totalCount.toString());
    } catch (error) {
      console.error('알림을 가져오는데 실패했습니다:', error);
    }
  };

  useEffect(() => {
    fetchAlerts();

    const intervalId = setInterval(() => {
      fetchAlerts();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

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
          <h3>알림 {unreadCount}개</h3>
          <ul className={styles.alertList}>
            {alerts.map((alert) => (
              <li
                key={alert.id}
                className={`${styles.alertItem} ${alert.read ? styles.readAlert : ''}`}
                onClick={() => handleReadAlert(alert.id)}
              >
                <span
                  className={`${styles.dot} ${
                    alert.result === 'accepted'
                      ? styles.accepted
                      : styles.rejected
                  }`}
                />
                <div className={styles.alertContent}>
                  <p className={styles.alertText}>
                    {alert.shop.item.name}(
                    {formatDate(alert.notice.item.startsAt)}) 공고 지원이{' '}
                    <span
                      className={
                        alert.result === 'accepted'
                          ? styles.acceptedText
                          : styles.rejectedText
                      }
                    >
                      {alert.result === 'accepted' ? '승인' : '거절'}
                    </span>
                    되었어요.
                  </p>
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
        title="새로운 알림"
        message="지원한 공고 응답이 도착했습니다."
      />
    </div>
  );
};

export default UserNotification;
