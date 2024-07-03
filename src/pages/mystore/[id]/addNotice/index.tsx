import { useRouter } from 'next/router';

import NoticeForm from '@/components/addNotice/AddNotice';

function AddNoticePage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id || typeof id !== 'string') {
    return <div>Loading...</div>;
  }

  return <NoticeForm shop_id={id} mode="add" />;
}

export default AddNoticePage;
