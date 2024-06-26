import { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import StoreCard from '@/components/myStore/MyStore';
import { GetMyStore, StoreInfo } from '@/pages/api/GetMystore';

import styles from './Mystore.module.scss';

interface MyStoreProps {
  storeData: StoreInfo | null;
}

const MyStore: NextPage<MyStoreProps> = ({ storeData }) => {
  if (!storeData) {
    return <div>Store not found</div>;
  }

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>내 가게</h1>
        <StoreCard storeData={storeData} />

        <h1 className={styles.title}>등록한 공고</h1>
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
      props: { storeData: null },
    };
  }

  try {
    const storeData = await GetMyStore(id);
    return {
      props: { storeData },
    };
  } catch (error) {
    console.error('Error fetching store data:', error);
    return {
      props: { storeData: null },
    };
  }
};

export default MyStore;
