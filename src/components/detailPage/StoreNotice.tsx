import Cookies from 'js-cookie';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import LoadingSpinner from '@/components/common/Spinner';
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

interface ExtendedStoreNoticeProps extends StoreNoticeProps {
  isLoading: boolean;
}

function StoreNotice({
  shopid,
  noticeid,
  storeData,
  isLogin,
  isProfile,
  userType,
  userid,
  isLoading,
}: ExtendedStoreNoticeProps) {
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [applicationId, setApplicationId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalButton, setModalbutton] = useState<ButtonProps[]>([]);
  const [modalIcon, setModalIcon] = useState<ModalIcon>(Icon);
  const [isToastMessage, setIsToastMessage] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const router = useRouter();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!storeData || !storeData.item) {
    return <div>데이터를 불러올 수 없습니다.</div>;
  }

  const { hourlyPay, startsAt, workhour, description, closed } = storeData.item;
  const { category, name, imageUrl, address1, originalHourlyPay } =
    storeData.item.shop.item;
  const increaseRate = calculateHourlyPayIncrease(originalHourlyPay, hourlyPay);
  const newIncreaseRate = Math.round(increaseRate);
  const startTime = formatDate(startsAt);
  const endTime = calculateEndTime(startsAt, workhour);
  const isExpired = new Date(startsAt) < new Date();
  const isClosedOrExpired = closed || isExpired;
  const endText = closed ? '마감 완료' : '지난 공고';

  const onClickLoginPage = () => {
    router.push('/login');
  };

  const onClickProfilePage = () => {
    router.push('/DetailedMyPage');
  };

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

  const handleApply = async () => {
    if (!isLogin) {
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
          setApplicationId(res.data.item.id);
          setIsApplied(true);
          setToastMessage('신청완료!');
          setIsToastMessage(true);
        } catch (error) {
          console.log('POST에러', error);
        }
      } else {
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

  const getUserApplications = async (userId: string) => {
    try {
      const res = await instance.get(`/users/${userId}/applications`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });

      const userApplications: Application[] = res.data.items;
      let applicationId: string = '';

      for (let i = 0; i < userApplications.length; i++) {
        const application = userApplications[i].item;
        if (
          application.notice.item.id === noticeid &&
          application.status === 'pending'
        ) {
          applicationId = application.id;
          break;
        }
      }
      if (applicationId) {
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
                {originalHourlyPay < hourlyPay && (
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
