import { useRouter } from 'next/router';

import NoticeForm from '@/components/addNotice/AddNotice';

function EditNoticePage() {
  const router = useRouter();
  const { id, notice_id } = router.query;

  if (
    !id ||
    !notice_id ||
    typeof id !== 'string' ||
    typeof notice_id !== 'string'
  ) {
    return <div>Loading...</div>;
  }

  return <NoticeForm shop_id={id} notice_id={notice_id} mode="edit" />;
}

export default EditNoticePage;
