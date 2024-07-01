import useWindowSize from '@/hooks/useWindowSize';

import Button from '../common/Button';
import styles from './ErrorModal.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  const { width } = useWindowSize();

  const getWindowSize = () => {
    return width <= 767 ? 'center' : 'right';
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalHeader}>{title}</h2>
        <p className={styles.modalMessage}>{message}</p>
        <Button
          className={styles.confirmButton}
          onClick={onClose}
          size="medium"
          position={getWindowSize()}
        >
          확인
        </Button>
      </div>
    </div>
  );
};

export default Modal;
