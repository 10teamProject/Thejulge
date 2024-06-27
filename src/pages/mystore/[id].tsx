import { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import MyNotice from '@/components/myStore/MyNotice';
import StoreCard from '@/components/myStore/MyStore';
import { GetMyStore, StoreInfo } from '@/pages/api/GetMystore';

import styles from './Mystore.module.scss';

interface MyStoreProps {
  storeData: StoreInfo | null;
  shop_id: string;
}

const MyStore: NextPage<MyStoreProps> = ({ storeData, shop_id }) => {
  if (!storeData) {
    return <div>Store not found</div>;
  }

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>내 가게</h1>
        <StoreCard storeData={storeData} />

        <h1 className={styles.title}>등록한 공고</h1>
        <MyNotice
          shop_id={shop_id}
          imageUrl={storeData.imageUrl}
          address1={storeData.address1}
          originalHourlyPay={storeData.originalHourlyPay}
        />
        <div />
      </div>
    </>
  );
};

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

export default MyStore;
