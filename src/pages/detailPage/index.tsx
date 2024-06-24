import Image from 'next/image';
import arrow from '@/public/assets/images/arrow.png';
import logo from '@/public/assets/images/biglogo.png';
import location from '@/public/assets/images/location.png';
import time from '@/public/assets/images/timers.png';
import styles from './DetailPage.module.scss';
import Card from '@/components/detailPage/Card';
import { useEffect, useState } from 'react';
import { instance } from '../api/AxiosInstance';

interface Props {
  shopid: string;
  noticeid: string;
}

interface StoreData {
  item: {
    closed?: boolean;
    hourlyPay: number;
    description: string;
    startsAt: string;
    workhour: number;
    shop: {
      item: {
        category: string;
        name: string;
        imageUrl: string;

        address1: string;
        address2?: string;
        description: string;
      };
    };
  };
}

function DetailPage({ shopid, noticeid }: Props) {
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [isApplied, setIsApplied] = useState(false);
  const applyButton = () => {
    setIsApplied(!isApplied);
  };
  console.log(storeData);

  async function getData() {
    // const res = await instance.get(`/shops/${shopid}/notices/${noticeid}`);
    const res = await instance.get(
      // 샘플 데이터 주소
      `/shops/63fcc375-5d0a-4ba4-ac5b-101b03973c74/notices/2ad3ac93-0054-442e-a882-d6cce8c10470`,
    );
    const nextRes = res.data;
    setStoreData(nextRes);
  }

  useEffect(() => {
    getData();
  }, []);

  if (storeData === null) {
    return; // 처음에 null이 있으면 화면에 렌더링 오류가 발생할 수 있으니 if문을 줘서 오류발생을 막음
  }

  return (
    <>
      <div className={styles.datail_container}>
        <div className={styles.shop_box}>
          <div className={styles.shop_title}>
            <h1>{storeData.item.shop.item.category}</h1>
            <h2>{storeData.item.shop.item.name}</h2>
          </div>

          <div className={styles.shop_info}>
            <div>
              <Image src={logo} className={styles.shop_img} alt="가게이미지" />
            </div>
            <div className={styles.shop_contents}>
              <h1>시급</h1>
              <div className={styles.shop_hourlPay}>
                {storeData.item.hourlyPay}
                <span>
                  기존 시급보다 50% <Image src={arrow} alt="상승" />
                </span>
              </div>
              <div className={styles.startsAt}>
                <Image src={time} alt="근무일" />
                {storeData.item.startsAt} ({storeData.item.workhour}시간)
              </div>
              <div className={styles.address}>
                <Image src={location} alt="위치" />
                {storeData.item.shop.item.address1}
              </div>
              <p>{storeData.item.shop.item.description}</p>
              <div>
                <button
                  className={`${styles.button} ${isApplied ? styles.true : styles.false}`}
                  onClick={applyButton}
                >
                  {isApplied ? '취소하기' : '신청하기'}
                </button>
              </div>
            </div>
          </div>

          <div className={styles.notice_description}>
            <h1>공고설명</h1>
            <p>{storeData.item.description}</p>
          </div>
        </div>
      </div>
      <div className={styles.notice_container}>
        <h1>최근에 본 공고</h1>
        <div>
          <Card />
        </div>
      </div>
    </>
  );
}

export default DetailPage;
