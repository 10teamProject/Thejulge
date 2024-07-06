import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import locationIcon from '@/public/assets/icon/location.svg';
import phoneIcon from '@/public/assets/icon/phone.svg';
import DetailCard from './Detailcard';
import ApplicantTable from './ApplicantTable';
import fetchAPI from '@/pages/api/AxiosInstance';
import Cookies from 'js-cookie';
import styles from './RenderingMyPage.module.scss';
import LoadingSpinner from '@/components/common/Spinner';

interface Props {
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
  user_id: string;
}

function RenderingMyPage({ name, phone, address, bio, user_id }: Props) {
  const router = useRouter();
  const [hasData, setHasData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkData = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get('token');
      const { data } = await fetchAPI().get(`/users/${user_id}/applications`, {
        params: { limit: 1 },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHasData(data.count > 0);
    } catch (error) {
      console.error('Error checking data:', error);
    } finally {
      setIsLoading(false);
    }
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="renderingPage">
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
              <div className={styles.buttonWrap}>
                <button className={styles.button} onClick={PostPageMove}>
                  편집하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.backgroundColor}>
        {hasData ? (
          <ApplicantTable user_id={user_id} />
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
