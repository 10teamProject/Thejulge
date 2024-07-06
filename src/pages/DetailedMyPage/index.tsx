import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import DetailCard from '../../components/detailProfile/Detailcard';
import RenderingMyPage from '../../components/detailProfile/RenderingMyPage';
import { instance } from '../api/AxiosInstance';
import styles from './MyPage.module.scss';
import LoadingSpinner from '../../components/common/Spinner'; // 로딩 스피너 컴포넌트를 추가합니다.

function MyPage() {
  const [userInfo, setUserInfo] = useState({
    user_id: '',
    name: '',
    phone: '',
    address: '',
    bio: '',
    notice_id: '',
  });

  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = Cookies.get('token');
      if (!token) {
        console.error('토큰이 없습니다.');
        setLoading(false);
        return;
      }

      try {
        const userId = JSON.parse(sessionStorage.getItem('user') || '{}').id;
        if (!userId) {
          console.error('사용자 ID를 찾을 수 없습니다.');
          setLoading(false);
          return;
        }

        const response = await instance.get(`/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        setUserInfo({
          ...response.data.item,
          user_id: userId, 
        });
        setLoading(false);
      } catch (error) {
        console.error('사용자 정보를 가져오는 데 실패했습니다:', error);
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const isUserInfoEmpty = () => {
    return !userInfo.name && !userInfo.phone && !userInfo.address && !userInfo.bio;
  };

  if (loading) {
    return <LoadingSpinner />; // 로딩 중일 때 스피너 띄우기
  }

  return (
    <main className={styles.main}>
      {isUserInfoEmpty() ? (
        <div className={styles.marginBox}>
          <DetailCard 
            title="내 프로필"
            content="내 프로필을 업데이트하고 원하는 가게에 지원해 보세요."
            buttonText="내 프로필 수정하기"
          />
        </div>
      ) : (
        <RenderingMyPage 
          name={userInfo.name}
          phone={userInfo.phone}
          address={userInfo.address}
          bio={userInfo.bio}
          user_id={userInfo.user_id}
          notice_id={userInfo.notice_id}
        />
      )}
    </main>
  );
}

export default MyPage;
