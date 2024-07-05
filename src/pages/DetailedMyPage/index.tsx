import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import DetailCard from '../../components/detail_Profile/Detailcard';
import RenderingMyPage from '../../components/detail_Profile/RenderingMyPage';
import { instance } from '../api/AxiosInstance';
import styles from './MyPage.module.scss';

function MyPage() {
  const [userInfo, setUserInfo] = useState({
    user_id: '',
    name: '',
    phone: '',
    address: '',
    bio: '',
    notice_id: '',
  });

  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = Cookies.get('token');
      if (!token) {
        console.error('토큰이 없습니다.');
        return;
      }

      try {
        const userId = JSON.parse(sessionStorage.getItem('user') || '{}').id;
        if (!userId) {
          console.error('사용자 ID를 찾을 수 없습니다.');
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
      } catch (error) {
        console.error('사용자 정보를 가져오는 데 실패했습니다:', error);
      }
    };

    fetchUserInfo();
  }, []);

  // 데이터가 있으면 RenderingMyPage 렌더링
  const isUserInfoEmpty = () => {
    return !userInfo.name && !userInfo.phone && !userInfo.address && !userInfo.bio;
  };

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