import Cookies from 'js-cookie';
import { GetServerSideProps } from 'next';
import { useCallback, useEffect, useState } from 'react';

import Card from '@/components/detailPage/Card';
import StoreNotice from '@/components/detailPage/StoreNotice';
import { Application, ProfileData, Props, User } from '@/types/detailPageType';
import { Notice, NoticeItem } from '@/utils/NoticeCard/NoticesType';

import { instance } from '../../../api/AxiosInstance';
import styles from './DetailPage.module.scss';

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

function DetailPage({
  shopid,
  noticeid, // 테스트한다고 임의로 값을 넣음. 나중에 지워줘야한다
}: Props) {
  const [storeData, setStoreData] = useState<NoticeItem>(initialStoreData);
  const [recentNotices, setRecentNotices] = useState<Notice[]>([]); // 로컬스토리지 담을 변수

  ///// 세션 스토리지와 관련된 변수들
  const [isLogin, setIsLogin] = useState<boolean>(false); // 로그인 여부를 확인
  const [isProfile, setIsProfile] = useState<boolean>(false); // 프로필 여부를 확인
  const [userType, setUserType] = useState<string>(''); // user가 알바생인지 사장님인지 확인
  const [applicationId, setApplicationId] = useState<string>(''); // applicaionId를 담는 변수인데 "신청하기" 버튼을 누르면 값이 담김

  /// 세션 스토리지에서 데이터 가져오기 구현
  const getSesstionStorageData = () => {
    const sessionStorageData = sessionStorage.getItem('user');
    if (sessionStorageData) {
      // 만약 세션 스토리지에 데이터가 있으면 실행
      const sessionData: User = JSON.parse(sessionStorageData); // 데이터를 JS로 변환
      setIsLogin(true); // 로그인여부를 true
      setUserType(sessionData.type); // 세션에 있는 유저 type 저장 (알바생 | 사장님)
      getCheckProfile(sessionData.id);
      getUserApplications(sessionData.id);
    }
  };

  /// 프로필 API로 요청을 보내서 프로필 여부를 확인하기
  const getCheckProfile = async (userId: string) => {
    try {
      const res = await instance.get(`/users/${userId}`);
      const profileData: ProfileData = res.data.item;
      // 만약 받아온 프로필 정보에 name,phone,address,bio가 없으면 프로필상태를 false로 있으면 true로 반환
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

  ///// 유저가 지원한 공고 확인하기
  const getUserApplications = async (userId: string) => {
    try {
      const res = await instance.get(`/users/${userId}/applications`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });

      const userApplications: Application[] = res.data.items; // response로 유저가 지원한 공고를 가져와서 저장(배열로 되어있음)
      let applicationId: string = ''; // response로 받은 공고들 중에 조건에 만족하는 applicationId를 저장하기 위해 선언함

      for (let i = 0; i < userApplications.length; i++) {
        const application = userApplications[i].item;
        if (
          application.notice.item.id === noticeid &&
          application.status === 'pending'
        ) {
          applicationId = application.id; // 위에 조건을 해당하면 그 데이터의 id를 저장하는데 id가 applicationId라고 보면 됨
          break; // 원하는 지원을 찾았으므로 반복문 종료, 하나만 존재할건데 그래도 혹시나 싶어서 break 줬음
        }
      }
      if (applicationId) {
        // applicationId이 있다는거는 post 요청을 서버로 보냈다는 뜻이니깐 버튼상태를 true로 반환하고 applicationId을 렌더링될 때 넣어줌
        // 이렇게 applicationId를 넣어주면 취소하기 클릭할 때 axios 에러가 생기지 않는다.
        setApplicationId(applicationId);
      }
    } catch (error) {
      console.log('application GET 에러 : ', error);
    }
  };

  async function getData() {
    try {
      const res = await instance.get(`/shops/${shopid}/notices/${noticeid}`);
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
  }, [shopid, noticeid]);

  return (
    <>
      <StoreNotice
        shopid={shopid}
        noticeid={noticeid}
        storeData={storeData}
        isLogin={isLogin}
        isProfile={isProfile}
        userType={userType}
        applicationId={applicationId}
        setApplicationId={setApplicationId}
      />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { shop_id, notice_id } = context.query;

  if (typeof shop_id !== 'string' || typeof notice_id !== 'string') {
    return {
      notFound: true,
    };
  }
  return { props: { shopid: shop_id, noticeid: notice_id } };
};