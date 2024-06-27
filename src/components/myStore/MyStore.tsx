import Image from 'next/image';
import React from 'react';

import { StoreInfo } from '@/pages/api/GetMystore';
import locationIcon from '@/public/assets/icon/location.svg';

import styles from './MyStore.module.scss';

interface StoreCardProps {
  storeData: StoreInfo;
}

const StoreCard: React.FC<StoreCardProps> = ({ storeData }) => (
  <div className={styles.card}>
    <div className={styles.imageContainer}>
      {storeData.imageUrl && (
        <Image
          src={storeData.imageUrl}
          alt={storeData.name}
          className={styles.image}
          width={539}
          height={300}
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
);

export default StoreCard;
