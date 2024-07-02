import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Slider from 'react-slick';

import { Notice } from '@/utils/NoticeCard/NoticesType';

import styles from './FitNotice.module.scss';
import NoticeCard from './NoticeCard';

type Props = {
  initialNotices: Notice[];
};

const FitNotice: React.FC<Props> = ({ initialNotices }) => {
  const topNotices = initialNotices
    .sort((a, b) => b.hourlyPay - a.hourlyPay)
    .slice(0, 9);

  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000, // 5초마다 슬라이드
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false, // 좌우 이동 버튼 제거
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className={styles.customContainer}>
      <div className={styles.customSection}>
        <h2 className={styles.title}>맞춤 공고</h2>
        <Slider {...settings} className={styles.carousel}>
          {topNotices.map((notice) => (
            <div key={notice.id}>
              <NoticeCard notice={notice} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default FitNotice;
