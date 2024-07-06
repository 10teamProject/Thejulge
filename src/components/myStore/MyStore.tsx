import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { StoreInfo } from '@/pages/api/getMystore';
import locationIcon from '@/public/assets/icon/location.svg';
import chickenImage from '@/public/assets/images/chicken.jpg';

import styles from './MyStore.module.scss';

interface StoreCardProps {
  storeData: StoreInfo;
}

const StoreCard: React.FC<StoreCardProps> = ({ storeData }) => {
  const router = useRouter();

  const handleAddNotice = () => {
    router.push(`/mystore/${storeData.id}/addNotice`);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {storeData.imageUrl && (
          <Image
            src={storeData.imageUrl}
            alt={storeData.name}
            className={styles.image}
            width={539}
            height={308}
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
          <Link
            href={`/storeRegister?shop_id=${storeData.id}`}
            className={styles.editButton}
          >
            편집하기
          </Link>
          <button className={styles.shareButton} onClick={handleAddNotice}>
            공고 등록하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
