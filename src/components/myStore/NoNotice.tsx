import Button from '@/components/common/Button';

import styles from './NoNotice.module.scss';

const NoNotice: React.FC = () => {
  return (
    <div className={styles.container}>
      <p className={styles.text}>공고를 등록해 보세요.</p>
      <Button size="full" className={styles.button}>
        공고 등록하기
      </Button>
    </div>
  );
};

export default NoNotice;
