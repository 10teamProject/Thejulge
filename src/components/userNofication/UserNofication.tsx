import Cookies from 'js-cookie';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  const [hasUnreadAlerts, setHasUnreadAlerts] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const fetchAlerts = async () => {
    try {
      const response: AlertResponse = await getUserAlerts(0, 10);
      setAlerts(response.items.map((item) => item.item));
      setHasUnreadAlerts(response.items.some((item) => !item.item.read));
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
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
      console.error('Error reading alert:', error);
    }
  };

  return (
    <div className={styles.notificationContainer}>
      <button
        ref={buttonRef}
        onClick={toggleNotification}
        className={styles.notificationButton}
      >
        <Image
          src={hasUnreadAlerts ? notificationActiveIcon : notificationIcon}
          alt="알림 아이콘"
          width={24}
          height={24}
        />
      </button>
      {isOpen && (
        <div ref={modalRef} className={styles.notificationModal}>
          <h3>알림 {alerts.length}개</h3>
          <ul className={styles.alertList}>
            {alerts.map((alert) => (
              <li
                key={alert.id}
                className={styles.alertItem}
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
    </div>
  );
};

export default UserNotification;
