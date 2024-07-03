import { useRouter } from 'next/router';

import Button from '@/components/common/Button';

import styles from './404.module.scss';

export default function Custom404() {
  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };
  return (
    <div className={styles.notFoundWrapper}>
      <div className={styles.notFoundContainer}>
        <span className={styles.errorStatus}>404 ERROR</span>
        <h1 className={styles.title}>페이지를 찾을 수 없습니다</h1>
        <p>페이지가 존재하지 않거나, 사용할 수 없는 페이지입니다.</p>
        <p>입력하신 주소가 정확한지 다시 한 번 확인해주세요.</p>
        <div className={styles.buttonWrapper}>
          <Button onClick={handleGoBack} bordered>
            이전 페이지
          </Button>
          <Button href="/">홈으로 가기</Button>
        </div>
      </div>
    </div>
  );
}
