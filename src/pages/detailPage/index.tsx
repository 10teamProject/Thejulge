import Image from 'next/image';

import logo from '@/public/assets/images/biglogo.png';
import location from '@/public/assets/images/location.png';
import time from '@/public/assets/images/timers.png';

import styles from './DetailPage.module.scss';

interface a {
  item: {
    id: string;
    hourlyPay: number;
    startsAt: string;
    workhour: number;
    description: string;
    closed: boolean;
    shop: {
      item: {
        id: string;
        name: string;
        category: string;
        address1: string;
        address2?: string;
        description: string;
        imageUrl?: string;
        originalHourlyPay: number;
      };
      href?: string;
    };
    currentUserApplication?: {
      item?: {
        id?: string; // application.id,
        status?: 'pending | accepted | rejected | canceled'; // application.status
        createdAt?: string; // application.createdAt
      };
    };
  };
}

function DetailPage() {
  const mock1: a = {
    item: {
      id: '0',
      hourlyPay: 15000,
      startsAt: '2024-06-21 15:00~18:00',
      workhour: 3,
      description:
        '기존 알바 친구가 그만둬서 새로운 친구를 구했는데, 그 사이에 하루가 비네요. 급해서 시급도 높였고 그렇게 바쁜 날이 아니라서 괜찮을거예요',
      closed: true,
      shop: {
        item: {
          id: '1',
          name: '너구리집',
          category: '일식',
          address1: '부산 북구',
          description:
            '알바하기 편한 너구리네 라면집!라면 올려두고 끓이기만 하면 되어서 쉬운 편에 속하는 가게입니다.',
          // imageUrl:
          originalHourlyPay: 10000,
        },
      },
    },
  };
  console.log(mock1);
  return (
    <>
      <div className={styles.datail_container}>
        <div className={styles.shop_box}>
          <div className={styles.shop_title}>
            <h1>식당</h1>
            <h2>도토리식당</h2>
          </div>

          <div className={styles.shop_info}>
            <div>
              <Image src={logo} className={styles.shop_img} alt="가게이미지" />
            </div>
            <div className={styles.shop_contents}>
              <h1>시급</h1>
              <div className={styles.shop_hourlPay}>
                {mock1.item.hourlyPay}원 <span>기존 시급보다 50% ^</span>
              </div>
              <div className={styles.startsAt}>
                <Image src={time} alt="근무일" />
                {mock1.item.startsAt}
              </div>
              <div className={styles.address}>
                <Image src={location} alt="위치" />
                {mock1.item.shop.item.address1}
              </div>
              <p>{mock1.item.shop.item.description}</p>
              <div>
                <button>신청하기</button>
              </div>
            </div>
          </div>

          <div className={styles.notice_description}>
            <h1>공고설명</h1>
            <p>{mock1.item.description}</p>
          </div>
        </div>
      </div>
      <div className={styles.notice_container}>
        <h1>최근에 본 공고</h1>
      </div>
    </>
  );
}

export default DetailPage;
