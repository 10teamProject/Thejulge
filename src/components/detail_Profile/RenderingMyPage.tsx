import Image from 'next/image';
import React from 'react';

import locationIcon from '@/public/assets/icon/location.svg';
import phoneIcon from '@/public/assets/icon/phone.svg'; 

import DetailCard from '../../components/detail_Profile/Detailcard'; 
import styles from './RenderingMyPage.module.scss';

interface Props {
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

function RenderingMyPage({ name, phone, address, bio }: Props) {
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
                <button className={styles.button}>편집하기</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.backgroundColor}>
        <DetailCard
          title="신청 내역"
          content="아직 신청 내역이 없어요."
          buttonText="공고 보러가기"
        />
      </div>
    </div>
  );
}

export default RenderingMyPage;