import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

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
import { Notice, NoticeItem } from '@/utils/NoticeCard/NoticesType';

import { instance } from '../api/AxiosInstance';
import styles from './DetailPage.module.scss';

interface Props {
  shopid: string;
  noticeid: string;
}

interface User {
  id: string;
  email: string;
  type: string;
}

interface ProfileData {
  name: string;
  phone: string;
  address: string;
  bio: string;
}

const initialStoreData: NoticeItem = {
  item: {
    id: '',
    closed: false,
    hourlyPay: 0,
    description: '',
    startsAt: '',
    workhour: 0,
    shop: {
      item: {
        id: '',
        name: '',
        category: '',
        imageUrl: '',
        originalHourlyPay: 0,
        address1: '',
        address2: '',
        description: '',
      },
    },
  },
  links: [
    {
      rel: '',
      description: '',
      method: '',
      href: '',
    },
  ],
};
function DetailPage({ shopid, noticeid }: Props) {
  const [storeData, setStoreData] = useState<NoticeItem>(initialStoreData);
  const { hourlyPay, startsAt, workhour, description } = storeData.item; //description은 이름이 겹쳐서 공고 description만 변수선언
  const { category, name, imageUrl, address1, originalHourlyPay } =
    storeData.item.shop.item;
  const increaseRate = calculateHourlyPayIncrease(originalHourlyPay, hourlyPay);
  const startTime = formatDate(startsAt);
  const endTime = calculateEndTime(startsAt, workhour);

  const [recentNotices, setRecentNotices] = useState<Notice[]>([]); // 로컬스토리지 담을 변수
  const [isApplied, setIsApplied] = useState(false);

  ///// 세션 스토리지와 관련된 변수들
  const [isLogin, setIsLogin] = useState<boolean>(false); // 로그인 여부를 확인
  const [userId, setUserId] = useState<string>(''); // user 아이디를 저장
  const [userType, setUserType] = useState<string>(''); // user가 알바생인지 사장님인지 확인
  const [isProfile, setIsProfile] = useState<boolean>(false); // 프로필 여부를 확인
  // console.log('로그인여부 : ', isLogin);
  // console.log('userId : ', userId);
  // console.log('userType : ', userType);
  // console.log('프로필여부 : ', isProfile);

  ////// 세션 스토리지에서 데이터 가져오기 구현
  const getSesstionStorageData = () => {
    const sessionStorageData = sessionStorage.getItem('user');
    if (sessionStorageData) {
      // 만약 세션 스토리지에 데이터가 있으면 실행
      const sessionData: User = JSON.parse(sessionStorageData); // 데이터를 JS로 변환
      setIsLogin(true); // 로그인여부를 true
      setUserId(sessionData.id); // 세션에 있는 유저 id 저장
      setUserType(sessionData.type); // 세션에 있는 유저 type 저장
      getCheckProfile(sessionData.id);
    }
  };

  ///// 프로필 API로 요청을 보내서 프로필 여부를 확인하기
  const getCheckProfile = async (userId: string) => {
    try {
      const res = await instance.get(`/users/${userId}`);
      const profileData: ProfileData = res.data.item;
      // 만약 받아온 프로필 정보에 name,phone,address,bio가 없으면 프로필여부를 true와 false로 지정
      if (
        !profileData.name ||
        !profileData.phone ||
        !profileData.address ||
        !profileData.bio
      ) {
        setIsProfile(false);
      } else {
        setIsProfile(true);
      }
    } catch (error) {
      console.log('프로필 API 연결 실패 : ', error);
    }
  };

  ///// 신청하기 버튼 구현하기
  const handleApply = async () => {
    if (!isLogin) {
      console.log('로그인이 필요합니다'); // 모달창과 함께 로그인페이지로 이동
    } else if (userType === 'employer') {
      console.log('사장님은 신청하지 못합니다.'); // 모달창
    } else if (isProfile) {
      console.log('프로필을 작성해주세요'); // 모달창과 함께 프로필 페이지로 이동
    } else {
      if (!isApplied) {
        try {
          // 일단 shopid와 noticeid를 받아오지 않아서 일단 주석처리 해놓음. 나중에 사용할거면 아래 주석처리 해제하면 된다.
          // const res = await instance.post(
          //   `/shops/${shopid}/notices/${noticeid}/applications`,
          //   {},
          //   {
          //     headers: {
          //       Authorization: `Bearer ${Cookies.get('token')}`,
          //     },
          //   },
          // );
          console.log('지원완료'); // 토스트 메시지
          setIsApplied(true);
        } catch (error) {
          console.log('POST에러', error);
        }
      } else {
        console.log('취소하시겠습니까?'); // 모달창
        try {
          // `/shops/${shopid}/notices/${noticeid}/applications/${applicationid}`; // 이 주소로 API PUT요청을 보내야한다.

          // const res = await instance.put(
          //   `/shops/${shopid}/notices/${noticeid}/applications/11111`,
          //   { status: 'canceled' },
          //   {
          //     headers: {
          //       Authorization: `Bearer ${Cookies.get('token')}`,
          //       'Content-Type': 'application/json',
          //     },
          //   },
          // );
          console.log('취소완료');
          setIsApplied(false);
        } catch (error) {
          console.log('PUT에러', error);
        }
      }
    }
  };

  async function getData() {
    try {
      // const res = await instance.get(`/shops/${shopid}/notices/${noticeid}`);
      const res = await instance.get(
        `/shops/fce32f91-a1aa-4699-a639-ea24a9cd1d12/notices/8c03c152-3d0c-4b78-b873-546318979cfc`,
      ); // 샘플 데이터
      const nextData = await res.data;
      setStoreData(nextData);
      localStorageUpdate(nextData.item);
    } catch (error) {
      console.log(error);
    }
  }

  ///// 로컬 스토리지에 저장하는 함수 구현
  const localStorageUpdate = useCallback((storeData: Notice) => {
    // 로컬 스토리지에 똑같은 key값으로 데이터를 저장할려면 로컬스토리지에 있는 데이터를 가져와서 병합해서 다시 넣어야한다.
    const localData = localStorage.getItem('RECENT_NOTICES');
    const recentLocalData: Notice[] = localData ? JSON.parse(localData) : [];

    // 로컬 스토리지에 있는 데이터랑 storeData랑 똑같은지 확인하는 코드, 존재하지 않는 데이터는 -1을 반환한다. 객체로 이뤄진 배열에서는 findIndex가 유용
    const existId = recentLocalData.findIndex(
      (StorageData) => StorageData.id === storeData.id,
    );

    // 존재하지 않는 데이터는 -1을 반환하는데 -1이 아니라면 존재한다는 뜻
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

    // 로컬 스토리지에 데이터를 넣을때는 JSON으로 변환해서 넣어야한다.
    localStorage.setItem('RECENT_NOTICES', JSON.stringify(recentLocalData));
    setRecentNotices(recentLocalData); // 카드 컴포넌트로 넘겨줄 데이터를 setter함수를 이용해 넣어준다.
  }, []);

  useEffect(() => {
    getData();
    getSesstionStorageData();
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
        {/* 카드 컴포넌트에는 로컬 스토리지에 있는 데이터 배열을 넘겨줘야한다 */}
        <div className={styles.card_container}>
          {recentNotices.map((recentNoticeData) => (
            <Card
              key={recentNoticeData.id}
              recentNoticeData={recentNoticeData}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default DetailPage;
