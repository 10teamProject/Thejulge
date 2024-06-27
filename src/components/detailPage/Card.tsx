import Image from 'next/image';
import { useRouter } from 'next/router';

import arrow from '@/public/assets/images/arrow.png';
import address from '@/public/assets/images/location.png';
import logo from '@/public/assets/images/logo.png';
import time from '@/public/assets/images/timers.png';
import {
  calculateEndTime,
  calculateHourlyPayIncrease,
  formatDate,
} from '@/utils/NoticeCard/CalculateThings';
import { Notice } from '@/utils/NoticeCard/NoticesType';

import styles from './Card.module.scss';

interface DetailCardProps {
  recentNoticeData: Notice; // 로컬 스토리지 정보
  storeData: Notice; // 가게 정보
}

const Card: React.FC<DetailCardProps> = ({ recentNoticeData, storeData }) => {
  // console.log('notice : ', recentNoticeData); // 넘어오는 데이터 확인
  // console.log('storeDataCard : ', storeData);

  const { hourlyPay, startsAt, workhour } = recentNoticeData;
  const { name, imageUrl, address1, originalHourlyPay } =
    recentNoticeData.shop.item;

  const increaseRate = calculateHourlyPayIncrease(originalHourlyPay, hourlyPay);
  const startTime = formatDate(startsAt);
  const endTime = calculateEndTime(startsAt, workhour);

  ////// 로컬 스토리지에 넣는 클릭 이벤트
  const handleLocalStorageSave = () => {
    const localData = localStorage.getItem('RECENT_NOTICES'); // 똑같은 key 값으로 데이터를 넣어줄려면 현재 있는 데이터를 가져와서 그거랑 합쳐서 넣어줘야함
    const recentLocalData: Notice[] = localData ? JSON.parse(localData) : [];

    //이미 존재하는 데이터의 인덱스 확인, 존재하지 않는 데이터는 -1을 반환한다. 객체로 이뤄진 배열에서는 findIndex가 유용
    const existId = recentLocalData.findIndex(
      (StorageData) => StorageData.id === storeData.id,
    );

    // 이미 존재하는 데이터는 splice함수를 사용해서 해당위치의 데이터를 제거하고 제거한 항목의 첫번째[0]을 사용해서 existNotice에 변수에 넣어준다.
    // unshift를 사용해서 배열의 맨앞으로 이동시킴
    if (existId !== -1) {
      const existNotice = recentLocalData.splice(existId, 1)[0];
      recentLocalData.unshift(existNotice);
    } else {
      // 동일한 id를 가진 데이터가 없으면 storeData를 배열의 제일 앞으로 추가한다
      recentLocalData.unshift(storeData);
    }

    // 로컬 스토리지에 넣을 데이터의 길이가 6이상이면 맨 끝의 값을 제거함.
    if (recentLocalData.length > 6) {
      recentLocalData.pop();
    }

    localStorage.setItem('RECENT_NOTICES', JSON.stringify(recentLocalData));
  };

  return (
    <>
      <div className={styles.card_container} onClick={handleLocalStorageSave}>
        <div className={styles.img_box}>
          <Image className={styles.shop_img} src={logo} alt="카드이미지" />
        </div>
        <div className={styles.shop_info}>
          <div className={styles.shop_info_box}>
            <div className={styles.shop_name}>{name}</div>
            <div className={styles.workAt}>
              <Image src={time} alt="알바시간" />
              {startTime}~{endTime} ({workhour}시간)
            </div>
            <div className={styles.address}>
              <Image src={address} alt="위치" />
              {address1}
            </div>
          </div>
          <div className={styles.hourlPay}>
            {hourlyPay}원
            {originalHourlyPay < hourlyPay && (
              <span>
                기존 시급보다 {increaseRate}%
                <Image src={arrow} alt="가격상승" />
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
