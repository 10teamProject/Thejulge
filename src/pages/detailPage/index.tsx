import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Card from '@/components/detailPage/Card';
import arrow from '@/public/assets/images/arrow.png';
import logo from '@/public/assets/images/biglogo.png';
import location from '@/public/assets/images/location.png';
import time from '@/public/assets/images/timers.png';
import {
  calculateEndTime,
  calculateHourlyPayIncrease,
  formatDate,
} from '@/utils/NoticeCard/CalculateThings';

import { instance } from '../api/AxiosInstance';
import styles from './DetailPage.module.scss';

interface Props {
  shopid: string;
  noticeid: string;
}

interface StoreData {
  item: {
    id: string;
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
        originalHourlyPay: number;
        address1: string;
        address2?: string;
        description: string;
      };
    };
  };
}

const initialStoreData: StoreData = {
  item: {
    id: '',
    closed: false,
    hourlyPay: 0,
    description: '',
    startsAt: '',
    workhour: 0,
    shop: {
      item: {
        category: '',
        name: '',
        imageUrl: '',
        originalHourlyPay: 0,
        address1: '',
        address2: '',
        description: '',
      },
    },
  },
};

function DetailPage({ shopid, noticeid }: Props) {
  const [storeData, setStoreData] = useState<StoreData>(initialStoreData);
  const { hourlyPay, startsAt, workhour, description } = storeData.item; //description은 이름이 겹쳐서 공고 description만 변수선언
  const { category, name, imageUrl, address1, originalHourlyPay } =
    storeData.item.shop.item;

  const [isApplied, setIsApplied] = useState(false);
  const [recentNotices, setRecentNotices] = useState<string[]>([]);

  console.log(recentNotices);

  const increaseRate = calculateHourlyPayIncrease(originalHourlyPay, hourlyPay);

  const startTime = formatDate(startsAt);
  const endTime = calculateEndTime(startsAt, workhour);

  const handleApply = () => {
    setIsApplied(!isApplied);
  };
  async function getData() {
    // const res = await instance.get(`/shops/${shopid}/notices/${noticeid}`);
    const res = await instance.get(
      `/shops/63fcc375-5d0a-4ba4-ac5b-101b03973c74/notices/3ddb7188-8ced-4021-9d07-663f98b5411b`,
    ); // 샘플 데이터 주소
    const nextRes = res.data;
    setStoreData(nextRes);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className={styles.datail_container}>
        <div className={styles.shop_box}>
          <div className={styles.shop_title}>
            <h1>{category}</h1>
            <h2>{name}</h2>
          </div>

          <div className={styles.shop_info}>
            <div>
              <Image src={logo} className={styles.shop_img} alt="가게이미지" />
            </div>
            <div className={styles.shop_contents}>
              <h1>시급</h1>
              <div className={styles.shop_hourlPay}>
                {hourlyPay}원
                {originalHourlyPay < hourlyPay && ( // 기존 금액이 현재 금액보다 작으면 화면에 렌더링
                  <span>
                    기존 시급보다 {increaseRate}%
                    <Image src={arrow} alt="상승" />
                  </span>
                )}
              </div>
              <div className={styles.startsAt}>
                <Image src={time} alt="근무일" />
                {startTime} ~ {endTime} ({workhour}시간)
              </div>
              <div className={styles.address}>
                <Image src={location} alt="위치" />
                {address1}
              </div>
              <p>{storeData.item.shop.item.description}</p>
              <div>
                <button
                  className={`${styles.button} ${isApplied ? styles.true : styles.false}`}
                  onClick={handleApply}
                >
                  {isApplied ? '취소하기' : '신청하기'}
                </button>
              </div>
            </div>
          </div>

          <div className={styles.notice_description}>
            <h1>공고설명</h1>
            <p>{description}</p>
          </div>
        </div>
      </div>
      <div className={styles.notice_container}>
        <h1>최근에 본 공고</h1>
        <div>
          <Card notice={storeData} />
          {/* 렌더링 잘되는지 storeData를 넣어봄 나중에 로컬 스토리지에 있는 데이터를 넘겨줘야함*/}
        </div>
      </div>
    </>
  );
}

export default DetailPage;
