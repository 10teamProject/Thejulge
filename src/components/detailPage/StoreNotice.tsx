import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { instance } from '@/pages/api/AxiosInstance';
import check from '@/public/assets/icon/check_Icon.svg';
import danger from '@/public/assets/icon/danger_mark.svg';
import location from '@/public/assets/icon/location.svg';
import time from '@/public/assets/icon/timer.svg';
import arrow from '@/public/assets/images/arrow.png';
import {
  Application,
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
  userid,
}: StoreNoticeProps) {
  const { hourlyPay, startsAt, workhour, description, closed } = storeData.item; //description은 이름이 겹쳐서 공고 description만 변수선언
  const { category, name, imageUrl, address1, originalHourlyPay } =
    storeData.item.shop.item;
  const increaseRate = calculateHourlyPayIncrease(originalHourlyPay, hourlyPay);
  const newIncreaseRate = Math.round(increaseRate);
  const startTime = formatDate(startsAt);
  const endTime = calculateEndTime(startsAt, workhour);
  const isExpired = new Date(startsAt) < new Date();
  const isClosedOrExpired = closed || isExpired;
  const endText = closed ? '마감 완료' : '지난 공고';

  const [isApplied, setIsApplied] = useState<boolean>(false); // 신청하기 버튼 상태관리변수
  const [applicationId, setApplicationId] = useState<string>(''); // applicaionId를 담는 변수, 신청하기 버튼을 누르거나 화면이 제일 처음 렌더링될 때 값이 담김

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

  ///// 유저가 지원한 공고 확인하기
  const getUserApplications = async (userId: string) => {
    try {
      const res = await instance.get(`/users/${userId}/applications`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });

      const userApplications: Application[] = res.data.items; // response로 유저가 지원한 공고를 가져와서 저장(배열로 되어있음)
      let applicationId: string = ''; // response로 받은 공고들 중에 조건에 만족하는 applicationId를 저장하기 위해 선언함

      for (let i = 0; i < userApplications.length; i++) {
        const application = userApplications[i].item;
        if (
          application.notice.item.id === noticeid &&
          application.status === 'pending'
        ) {
          applicationId = application.id; // 위에 조건을 해당하면 그 데이터의 id를 저장하는데 id가 applicationId라고 보면 됨
          break; // 원하는 지원을 찾았으므로 반복문 종료, 하나만 존재할건데 그래도 혹시나 싶어서 break 줬음
        }
      }
      if (applicationId) {
        // applicationId이 있다는거는 post 요청을 서버로 보냈다는 뜻이니깐 버튼상태를 true로 반환하고 applicationId을 렌더링될 때 넣어줌
        // 이렇게 applicationId를 넣어주면 취소하기 클릭할 때 axios 에러가 생기지 않는다.
        setApplicationId(applicationId);
        setIsApplied(true);
      } else {
        setApplicationId('');
        setIsApplied(false);
      }
    } catch (error) {
      console.log('application GET 에러 : ', error);
    }
  };

  useEffect(() => {
    if (!userid) return;
    // getUserApplications함수가 userid가 있어야 유저가 지원했는지 확인할 수 있기 때문에 처음에 렌더링될 때 userid가 빈값인 것을 고려해서 return을 했음

    getUserApplications(userid);
  }, [userid, noticeid]);

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

              {isClosedOrExpired && (
                <div className={styles.img_closed}>{endText}</div>
              )}

              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="가게이미지"
                  fill
                  className={`${styles.shop_img} ${isClosedOrExpired ? styles.img_filter : ''}`}
                />
              )}
            </div>
            <div className={styles.shop_contents}>
              <h1>시급</h1>
              <div className={styles.pay_box}>
                <div className={styles.shop_hourlPay}>
                  {hourlyPay.toLocaleString('ko-KR')}원
                </div>
                {originalHourlyPay < hourlyPay && ( // 기존 금액이 현재 금액보다 작으면 화면에 렌더링
                  <div
                    className={`${isClosedOrExpired ? styles.hidden : styles.increaseRate}`}
                  >
                    <p className={styles.badge}>
                      기존 시급보다 {newIncreaseRate}%
                    </p>
                    <Image src={arrow} alt="상승" />
                  </div>
                )}
                <div className={styles.pay_hover}>
                  <div>{hourlyPay.toLocaleString('ko-KR')}원</div>
                  <div>기존 시급보다 {newIncreaseRate}%</div>
                </div>
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
                  className={`${styles.button} ${isApplied ? styles.true : styles.false} ${isClosedOrExpired ? styles.closed : ''}`}
                  onClick={handleApply}
                  disabled={isClosedOrExpired}
                >
                  {isClosedOrExpired
                    ? '신청불가'
                    : isApplied
                      ? '취소하기'
                      : '신청하기'}
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
