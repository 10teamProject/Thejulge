import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import locationIcon from '@/public/assets/icon/location.svg';
import phoneIcon from '@/public/assets/icon/phone.svg';

import DetailCard from '../../components/detail_Profile/Detailcard';
import ApplicantTable from './ApplicantTable';
import fetchAPI from '@/pages/api/AxiosInstance'; // fetchAPI import 추가
import Cookies from 'js-cookie'; // Cookies import 추가
import styles from './RenderingMyPage.module.scss';

interface Props {
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
  user_id: string; 
  notice_id: string;
}

function RenderingMyPage({ name, phone, address, bio, user_id, notice_id }: Props) {
  const router = useRouter();
  const [hasData, setHasData] = useState(false);

  const checkData = async () => {
    const token = Cookies.get('token');

    const { data } = await fetchAPI().get(`/users/${user_id}/applications`, {
      params: { limit: 1 }, // 데이터 1개 이상 있으면 페이지 조건부 렌더링 작동
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setHasData(data.count > 0);
  };

  useEffect(() => {
    checkData();
  }, []);

  const PostPageMove = () => {
    router.push({
      pathname: '/PostMyPage',
      query: { name, phone, address, bio },
    });
  };

  const ListPageMove = () => {
    router.push('/listPage');
  };

  return (
    <div className='renderingPage'>
      <div className={styles.profileWrap}>
        <div className={styles.informationWrap}>
          <h1 className={styles.profileTitle}>내 프로필</h1>
          <div className={styles.userWrap}>
            <div className={styles.userFlex}>
              <div className={styles.titleWrap}>
                <h4 className={styles.nameProfile}>이름</h4>
                <p className={styles.userName}>{name}</p>
                
                <div className={styles.informationFlex}>
                  <Image
                    src={phoneIcon}
                    alt="전화 아이콘"
                    width={20}
                    height={20}
                  />
                  <p className={styles.information}>{phone}</p>
                </div>
                
                <div className={styles.informationFlex}>
                  <Image
                    src={locationIcon}
                    alt="위치 아이콘"
                    width={20}
                    height={20}
                  />
                  <p className={styles.information}>선호 지역: {address}</p>
                </div>
                
                <p className={`${styles.information} ${styles.bio}`}>{bio}</p>
              </div>
              
              <div>
                <button className={styles.button} onClick={PostPageMove}>편집하기</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.backgroundColor}>
        {hasData ? (
          <ApplicantTable user_id={user_id} notice_id={notice_id} /> 
        ) : (
          <DetailCard
            title="신청 내역"
            content="아직 신청 내역이 없어요."
            buttonText="공고 보러가기"
            onButtonClick={ListPageMove}
          />
        )}
      </div>
    </div>
  );
}

export default RenderingMyPage;