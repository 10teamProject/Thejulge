import { GetServerSideProps, NextPage } from 'next';

import ApplicantTable from '@/components/myStore/ApplicantList';
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
      <div className={styles.labelContainer}>
        <label className={styles.title}>식당</label>
        <h1 className={styles.shopName}>{noticeData.item.shop.item.name}</h1>
      </div>
      <NoticeCard noticeData={noticeData} />
      <label className={styles.applicantTitle}>신청자 목록</label>
      <ApplicantTable
        shop_id={noticeData.item.shop.item.id}
        notice_id={noticeData.item.id}
      />
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
