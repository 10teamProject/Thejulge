import { GetServerSideProps } from 'next';

import MyNotice from '@/components/myStore/MyNotice';
import StoreCard from '@/components/myStore/MyStore';
import StoreRegistration from '@/components/myStore/StoreRegistration';
import { GetMyStore, StoreInfo } from '@/pages/api/getMystore';

import styles from './Mystore.module.scss';

interface MyStoreProps {
  storeData: StoreInfo | null;
  shop_id: string;
}

export default function MyStorePage({ storeData }: MyStoreProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>내 가게</h1>
      {storeData ? (
        <>
          <StoreCard storeData={storeData} />
          <h1 className={styles.title}>내가 등록한 공고</h1>
          <MyNotice shop={storeData} />
          <div />
        </>
      ) : (
        <StoreRegistration />
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<MyStoreProps> = async (
  context,
) => {
  const { id } = context.query;

  if (typeof id !== 'string') {
    return {
      props: { storeData: null, shop_id: '' },
    };
  }

  try {
    const storeData = await GetMyStore(id);
    return {
      props: { storeData, shop_id: id },
    };
  } catch (error) {
    console.error('Error fetching store data:', error);
    return {
      props: { storeData: null, shop_id: id },
    };
  }
};
