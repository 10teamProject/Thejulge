import Image from 'next/image';
import React from 'react';

import location from '@/public/assets/images/loacation.svg'
import phoneIcon from '@/public/assets/images/phone.svg'

import DetailCard from '../../components/detail_Profile/Detailcard';
import styles from './MyPage.module.scss'

function MyPage() {
  return (
    <main className={styles.main}>
      <div className={styles.marginBox}>
        <DetailCard 
          title="내 프로필"
          content="내 프로필을 업데이트하고 원하는 가게에 지원해 보세요."
          buttonText="내 프로필 수정하기" 
        />
      </div>
      <div className='renderingPage'>
        <div className={styles.profileWrap}>
          <div className={styles.informationWrap}>
            <h1 className={styles.profileTitle}>내 프로필</h1>
            <div className={styles.userWrap}>
              <div className={styles.userFlex}>
                <div className={styles.titleWrap}>
                <h4 className={styles.nameProfile}>이름</h4>
                <p className={styles.userName}>김승우</p>
                
                <div className={styles.informationFlex}>
                  <Image
                    src={phoneIcon}
                    alt="폰 아이콘"
                    width={20} 
                    height={20} 
                  />
                  <p className={styles.information}>010-1234-5678</p>
                </div>
                <div className={styles.informationFlex}>
                  <Image
                    src={location}
                    alt="폰 아이콘"
                    width={20} 
                    height={20} 
                  />
                  <p className={styles.information}>선호 지역: {/*지역 데이터*/}</p>
                </div>
                  <p className={`${styles.information} ${styles.bio}`}>열심히 일 하겠습니다.</p>
                </div>
                <div>
                  <button className={styles.button}>편집하기</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.backgroundColor}>
        <DetailCard title="신청 내역"
          content="아직 신청 내역이 없어요."
          buttonText="공고 보러가기"
        />  
        </div>
    </div>
    </main>
  );
}

export default MyPage;