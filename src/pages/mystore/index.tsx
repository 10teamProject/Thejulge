import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import StoreRegistration from '@/components/myStore/StoreRegistration';

import { GetUserInfo } from '../api/GetUserInfo';
import styles from './Mystore.module.scss';
import LoadingSpinner from '@/components/common/Spinner';

export default function MyStorePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserInfo = async () => {
      const userInfo = await GetUserInfo();

      if (userInfo && userInfo.type === 'employer' && userInfo.shop?.item?.id) {
        router.replace(`/mystore/${userInfo.shop.item.id}`);
      } else {
        setIsLoading(false);
      }
    };

    checkUserInfo();
  }, [router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>내 가게</h1>
      <StoreRegistration />
    </div>
  );
}
