import { useEffect } from 'react';

import styles from './ToastMessage.module.scss';

interface ToastProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

/**
 * 사용예시
 *
 * <Toast
 *  isOpen={isToastMessage}
 *  message={'넣고 싶은 텍스트를 작성하시면 됩니다'}
 *  onClose={() => setIsToastMessage(false)}
 * />
 *
 *
 *
 *
 *
 */

function Toast({ isOpen, message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isOpen) return null;
  return (
    <div className={styles.messageCotainer}>
      <div className={styles.messageBox}>{message}</div>
    </div>
  );
}

export default Toast;
