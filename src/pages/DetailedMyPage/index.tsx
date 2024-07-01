import React from 'react';

import DetailCard from '../../components/detail_Profile/Detailcard';
import styles from './DetailedMyPage.module.scss'

function DetailedMyPageUpdate() {
  return (
    <main className={styles.main}>
      <div className={styles.marginBox}>
        <DetailCard 
          title="내 프로필"
          content="내 프로필을 업데이트하고 원하는 가게에 지원해 보세요."
          buttonText="내 프로필 수정하기" 
        />
      </div>
    </main>
  );
}

export default DetailedMyPageUpdate;