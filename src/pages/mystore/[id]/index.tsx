import { GetServerSideProps, NextPage } from 'next';

import MyNotice from '@/components/myStore/MyNotice';
import StoreCard from '@/components/myStore/MyStore';
import { GetMyStore, StoreInfo } from '@/pages/api/getMystore';

import styles from '../Mystore.module.scss';

interface MyStoreProps {
  storeData: StoreInfo | null;
  shop_id: string;
}

const MyStore: NextPage<MyStoreProps> = ({ storeData }) => {
  if (!storeData) {
    return <div>Store not found</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>내 가게</h1>
      <StoreCard storeData={storeData} />
      <h1 className={styles.title}>등록한 공고</h1>
      <MyNotice shop={storeData} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<MyStoreProps> = async (
  context,
) => {
  const { id } = context.query;

  if (typeof id !== 'string') {
    return {
      notFound: true,
    };
  }

  try {
    const storeData = await GetMyStore(id);
    if (!storeData) {
      return {
        notFound: true,
      };
    }
    return {
      props: { storeData, shop_id: id },
    };
  } catch (error) {
    console.error('데이터를 불러오는데 실패:', error);
    return {
      notFound: true,
    };
  }
};

export default MyStore;
