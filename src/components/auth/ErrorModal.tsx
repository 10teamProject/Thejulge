import styles from './ErrorModal.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalHeader}>{title}</h2>
        <p className={styles.modalMessage}>{message}</p>
        <button className={styles.confirmButton} onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
};

export default Modal;
