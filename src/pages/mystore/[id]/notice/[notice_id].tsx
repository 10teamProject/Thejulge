import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import { GetMyNoticeDetail } from '@/pages/api/GetMyNotice';
import { JobResponse } from '@/types/myStoreType';

interface NoticeDetailProps {
  noticeData: JobResponse | null;
}

const NoticeDetailPage: NextPage<NoticeDetailProps> = ({ noticeData }) => {
  const router = useRouter();

  if (!noticeData || !noticeData.item) {
    return <div>Notice not found</div>;
  }

  const { item } = noticeData;

  return (
    <div>
      <h1>공고 상세 정보</h1>
      <h2>{item.description}</h2>
      <p>시급: {item.hourlyPay}원</p>
      <p>시작 시간: {new Date(item.startsAt).toLocaleString()}</p>
      <p>근무 시간: {item.workhour}시간</p>
      <p>주소: {item.shop.item.address1}</p>
      <p>가게 이름: {item.shop.item.name}</p>
      <p>카테고리: {item.shop.item.category}</p>
      <p>가게 설명: {item.shop.item.description}</p>
      {item.currentUserApplication && (
        <p>지원 상태: {item.currentUserApplication.item.status}</p>
      )}
      <button onClick={() => router.back()}>뒤로 가기</button>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<NoticeDetailProps> = async (
  context,
) => {
  const { id, notice_id } = context.query;

  if (typeof id !== 'string' || typeof notice_id !== 'string') {
    return { props: { noticeData: null } };
  }

  try {
    const noticeData = await GetMyNoticeDetail(id, notice_id);
    console.log('Received notice data:', JSON.stringify(noticeData, null, 2));
    return {
      props: { noticeData },
    };
  } catch (error) {
    console.error('Error fetching notice data:', error);
    return {
      props: { noticeData: null },
    };
  }
};

export default NoticeDetailPage;
