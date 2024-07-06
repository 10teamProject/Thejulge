import { useRouter } from 'next/router';

import Button from '@/components/common/Button';

import styles from './NoNotice.module.scss';

interface NoNoticeProps {
  shopId: string;
}

const NoNotice: React.FC<NoNoticeProps> = ({ shopId }) => {
  const router = useRouter();

  const handleAddNotice = () => {
    router.push(`/mystore/${shopId}/addNotice`);
  };

  return (
    <div className={styles.container}>
      <p className={styles.text}>공고를 등록해 보세요.</p>
      <Button size="full" className={styles.button} onClick={handleAddNotice}>
        공고 등록하기
      </Button>
    </div>
  );
};

export default NoNotice;
