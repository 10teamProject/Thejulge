import { GetServerSideProps } from 'next';
import { useCallback, useEffect, useState } from 'react';

import Card from '@/components/detailPage/Card';
import StoreNotice from '@/components/detailPage/StoreNotice';
import LoadingSpinner from '@/components/common/Spinner';
import { ProfileData, Props, User } from '@/types/detailPageType';
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

function DetailPage({ shopid, noticeid }: Props) {
  const [storeData, setStoreData] = useState<NoticeItem>(initialStoreData);
  const [recentNotices, setRecentNotices] = useState<Notice[]>([]);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isProfile, setIsProfile] = useState<boolean>(false);
  const [userType, setUserType] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getSesstionStorageData = () => {
    const sessionStorageData = sessionStorage.getItem('user');
    if (sessionStorageData) {
      const sessionData: User = JSON.parse(sessionStorageData);
      setIsLogin(true);
      setUserType(sessionData.type);
      getCheckProfile(sessionData.id);
      setUserId(sessionData.id);
    }
  };

  const getCheckProfile = async (userId: string) => {
    try {
      const res = await instance.get(`/users/${userId}`);
      const profileData: ProfileData = res.data.item;
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

  async function getData() {
    setIsLoading(true);
    try {
      const res = await instance.get(`/shops/${shopid}/notices/${noticeid}`);
      const nextData = await res.data;
      setStoreData(nextData);
      localStorageUpdate(nextData.item);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  const localStorageUpdate = useCallback((storeData: Notice) => {
    const localData = localStorage.getItem('RECENT_NOTICES');
    const recentLocalData: Notice[] = localData ? JSON.parse(localData) : [];

    const existId = recentLocalData.findIndex(
      (StorageData) => StorageData.id === storeData.id,
    );

    if (existId !== -1) {
      const existNotice = recentLocalData.splice(existId, 1)[0];
      recentLocalData.unshift(existNotice);
    } else {
      recentLocalData.unshift(storeData);
    }

    if (recentLocalData.length > 6) {
      recentLocalData.pop();
    }

    localStorage.setItem('RECENT_NOTICES', JSON.stringify(recentLocalData));
    setRecentNotices(recentLocalData);
  }, []);

  useEffect(() => {
    getData();
    getSesstionStorageData();
  }, [shopid, noticeid]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <StoreNotice
        shopid={shopid}
        noticeid={noticeid}
        storeData={storeData}
        isLogin={isLogin}
        isProfile={isProfile}
        userType={userType}
        userid={userId}
        isLoading={isLoading}
      />
      <div className={styles.notice_container}>
        <h1>최근에 본 공고</h1>
        <div className={styles.card_container}>
          {recentNotices.map((recentNoticeData) => (
            <Card
              key={recentNoticeData.id}
              recentNoticeData={recentNoticeData}
              isLoading={isLoading}
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
