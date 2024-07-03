import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { instance } from '@/pages/api/AxiosInstance';
import check from '@/public/assets/icon/check_Icon.svg';
import danger from '@/public/assets/icon/danger_mark.svg';
import arrow from '@/public/assets/images/arrow.png';
import location from '@/public/assets/images/location.png';
import time from '@/public/assets/images/timers.png';
import {
  ButtonProps,
  ModalIcon,
  StoreNoticeProps,
} from '@/types/detailPageType';
import {
  calculateEndTime,
  calculateHourlyPayIncrease,
  formatDate,
} from '@/utils/NoticeCard/CalculateThings';

import Modal from '../common/ConfirmModal';
import Toast from '../common/ToastMessage';
import styles from './StoreNotice.module.scss';

const Icon: ModalIcon = {
  src: '',
  height: 0,
  width: 0,
};

function StoreNotice({
  shopid,
  noticeid,
  storeData,
  isLogin,
  isProfile,
  userType,
  applicationId,
  setApplicationId,
}: StoreNoticeProps) {
  const { hourlyPay, startsAt, workhour, description, closed } = storeData.item; //description은 이름이 겹쳐서 공고 description만 변수선언
  const { category, name, imageUrl, address1, originalHourlyPay } =
    storeData.item.shop.item;
  const increaseRate = calculateHourlyPayIncrease(originalHourlyPay, hourlyPay);
  const startTime = formatDate(startsAt);
  const endTime = calculateEndTime(startsAt, workhour);
  const [isApplied, setIsApplied] = useState<boolean>(false); // 신청하기 버튼 상태관리변수

  ///// 모달창과 관련된 변수들
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달창 상태여부
  const [modalMessage, setModalMessage] = useState(''); // 모달창에 내려줄 메시지 관리
  const [modalButton, setModalbutton] = useState<ButtonProps[]>([]); // 모달창에 내려줄 버튼 관리
  const [modalIcon, setModalIcon] = useState<ModalIcon>(Icon); // 모달창에 내려줄 아이콘

  const router = useRouter();

  /////토스트 메시지와 관련된 변수들
  const [isToastMessage, setIsToastMessage] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 로그인 페이지로 이동하는 이벤트
  const onClickLoginPage = () => {
    router.push('/login');
  };

  // 프로필 페이지로 이동하는 이벤트
  const onClickProfilePage = () => {
    router.push('/DetailedMyPage');
  };

  // 취소하기 버튼 클릭시 PUT 요청 보내는 이벤트
  const onClickPutRequest = async () => {
    try {
      await instance.put(
        `/shops/${shopid}/notices/${noticeid}/applications/${applicationId}`,
        { status: 'canceled' },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
            'Content-Type': 'application/json',
          },
        },
      );
      setIsApplied(false);
      setIsModalOpen(false);
      setApplicationId('');
      setToastMessage('취소완료!');
      setIsToastMessage(true);
    } catch (error) {
      console.log('PUT 요청에러', error);
    }
  };

  ///// 신청하기 버튼 구현하기
  const handleApply = async () => {
    if (!isLogin) {
      // 로그인이 되지 않은 경우
      setIsModalOpen(true);
      setModalIcon(danger);
      setModalMessage('로그인이 필요합니다');
      setModalbutton([
        {
          text: '확인',
          onClick: onClickLoginPage,
          variant: 'primary',
        },
      ]);
    } else if (userType === 'employer') {
      // 사장님으로 로그인한 경우
      setIsModalOpen(true);
      setModalIcon(danger);
      setModalMessage('사장님은 신청할 수 없습니다');
      setModalbutton([
        {
          text: '확인',
          onClick: () => setIsModalOpen(false),
          variant: 'primary',
        },
      ]);
    } else if (!isProfile) {
      // 알바생으로 로그인은 했지만 프로필을 작성하지 않은 경우
      setIsModalOpen(true);
      setModalIcon(danger);
      setModalMessage('내 프로필을 먼저 등록해주세요');
      setModalbutton([
        {
          text: '확인',
          onClick: onClickProfilePage,
          variant: 'primary',
        },
      ]);
    } else {
      if (!isApplied) {
        // 버튼이 신청하기인 경우
        try {
          const res = await instance.post(
            `/shops/${shopid}/notices/${noticeid}/applications`,
            {},
            {
              headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
              },
            },
          );
          setApplicationId(res.data.item.id); // 리스폰스로 받은 application_id를 넣는다.
          setIsApplied(true);
          setToastMessage('신청완료!');
          setIsToastMessage(true);
        } catch (error) {
          console.log('POST에러', error);
        }
      } else {
        // 버튼이 취소하기인 경우
        setIsModalOpen(true);
        setModalIcon(check);
        setModalMessage('신청을 취소하시겠어요?');
        setModalbutton([
          {
            text: '취소',
            onClick: () => setIsModalOpen(false),
            variant: 'secondary',
          },

          {
            text: '확인',
            onClick: onClickPutRequest,
            variant: 'primary',
          },
        ]);
      }
    }
  };

  useEffect(() => {
    // applicationId에 값이 ''이 아니면 현재 서버에 신청을 해놓은 상태니깐 버튼박스를 취소하기로 바꾼다
    if (applicationId !== '') {
      setIsApplied(true);
    }
  }, [applicationId]);

  return (
    <>
      <div className={styles.datail_container}>
        <div className={styles.shop_box}>
          <div className={styles.shop_title}>
            <h1>{category}</h1>
            <h2>{name}</h2>
          </div>

          <div className={styles.shop_info}>
            <div className={styles.shop_img_box}>
              {closed && <div className={styles.img_closed}>마감 완료</div>}
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="가게이미지"
                  fill
                  className={styles.shop_img}
                />
              )}
            </div>
            <div className={styles.shop_contents}>
              <h1>시급</h1>
              <div className={styles.shop_hourlPay}>
                {hourlyPay.toLocaleString('ko-KR')}원
                {originalHourlyPay < hourlyPay && ( // 기존 금액이 현재 금액보다 작으면 화면에 렌더링
                  <span>
                    <p className={styles.badge}>
                      기존 시급보다 {increaseRate}%
                    </p>
                    <Image src={arrow} alt="상승" />
                  </span>
                )}
              </div>
              <div className={styles.startsAt}>
                <Image src={time} alt="근무일" />
                {startTime} ~ {endTime} ({workhour}시간)
              </div>
              <div className={styles.address}>
                <Image src={location} alt="위치" />
                {address1}
              </div>
              <p>{storeData.item.shop.item.description}</p>
              <div>
                <button
                  className={`${styles.button} ${isApplied ? styles.true : styles.false} ${closed ? styles.closed : ''}`}
                  onClick={handleApply}
                  disabled={closed}
                >
                  {closed ? '신청불가' : isApplied ? '취소하기' : '신청하기'}
                </button>
                <Modal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  icon={<Image src={modalIcon} alt="모달창이미지" />}
                  message={modalMessage}
                  buttons={modalButton}
                />
                <Toast
                  isOpen={isToastMessage}
                  message={toastMessage}
                  onClose={() => setIsToastMessage(false)}
                />
              </div>
            </div>
          </div>

          <div className={styles.notice_description}>
            <h1>공고설명</h1>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default StoreNotice;
