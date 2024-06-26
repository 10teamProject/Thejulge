import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import React from 'react';

import { GetMyStore, StoreInfo } from '@/pages/api/GetMystore';
import locationIcon from '@/public/assets/icon/location.svg';

import styles from './Mystore.module.scss';

interface MyStoreProps {
  storeData: StoreInfo | null;
}

const MyStore: NextPage<MyStoreProps> = ({ storeData }) => {
  if (!storeData) {
    return <div>Store not found</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>내 가게</h1>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          {storeData.imageUrl && (
            <img
              src={storeData.imageUrl}
              alt={storeData.name}
              className={styles.image}
            />
          )}
        </div>
        <div className={styles.content}>
          <span className={styles.category}>식당</span>
          <h2 className={styles.storeName}>{storeData.name}</h2>
          <p className={styles.location}>
            <Image src={locationIcon} alt="Location" className={styles.icon} />
            {storeData.address1} {storeData.address2}
          </p>
          <p className={styles.description}>{storeData.description}</p>
          <div className={styles.buttonContainer}>
            <button className={styles.editButton}>편집하기</button>
            <button className={styles.shareButton}>공고 등록하기</button>
          </div>
        </div>
      </div>
    </div>
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
