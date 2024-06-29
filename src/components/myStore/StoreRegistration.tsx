import Button from '../common/Button';
import styles from './StoreRegistration.module.scss';

const StoreRegistration = () => {
  return (
    <div className={styles.registerContainer}>
      <p>내 가게도 소개하고 공고도 등록 해보세요.</p>
      <Button children="가게 등록하기" href="/storeRegister" />
    </div>
  );
};

export default StoreRegistration;
