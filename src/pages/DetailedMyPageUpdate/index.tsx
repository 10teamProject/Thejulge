import React from 'react';

import DetailCard from '../../components/detail_Profile/Detailcard';
import styles from './DetailedMyPageUpdate.module.scss'

function DetailedMyPageUpdate() {
  return (
    <main>
      <div className='내 프로필 전체 상자'>
        <div className='내 프로필과 flex로 나열해주기 위한 겉상자'>
          <h1>내 프로필</h1>
          <div className='내 정보가 담긴 상자이자 flex 배열 적용예정'>
            <h4>이름</h4>
            <p>누군가의 이름</p>
            <p>전화번호자리</p>
            <p>지역 자리</p>
            <p>소개</p>
            <button>편집하기</button>
          </div>
        </div>

      </div>
      <div className={styles.backgroundColor}>
      <DetailCard title="신청 내역"
        content="아직 신청 내역이 없어요."
        buttonText="공고 보러가기"
      />  
      </div>
    </main>
  );
}

export default DetailedMyPageUpdate;