import { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import NoticeCard from '@/components/myStore/MyNoticeDetial';
import { GetMyNoticeDetail } from '@/pages/api/GetMyNotice';
import { JobResponse } from '@/types/myStoreType';

import styles from './NoticeDetial.module.scss';

interface NoticeDetailProps {
  noticeData: JobResponse | null;
}

const NoticeDetailPage: NextPage<NoticeDetailProps> = ({ noticeData }) => {
  if (!noticeData || !noticeData.item) {
    return <div>Notice not found</div>;
  }

  return (
    <div className={styles.container}>
      <NoticeCard noticeData={noticeData} />
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
