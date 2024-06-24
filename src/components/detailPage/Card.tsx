import Image from 'next/image';
import styles from './Card.module.scss';
import logo from '@/public/assets/images/logo.png';
import time from '@/public/assets/images/timers.png';
import address from '@/public/assets/images/location.png';
import arrow from '@/public/assets/images/arrow.png';

function Card() {
  return (
    <div className={styles.card_container}>
      <Image className={styles.shot_img} src={logo} alt="카드이미지" />
      <div className={styles.shop_name}>명륜진사갈비</div>
      <div className={styles.workAt}>
        <Image src={time} alt="알바시간" />
        2024-06-21 15:00~18:00
      </div>
      <div className={styles.address}>
        <Image src={address} alt="위치" />
        부산 해운대
      </div>
      <div className={styles.hourlPay}>
        13000
        <span>
          기존 시급보다 100%
          <Image src={arrow} alt="가격상승" />
        </span>
      </div>
    </div>
  );
}

export default Card;
