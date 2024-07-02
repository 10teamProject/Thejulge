import { useRouter } from 'next/router';

import AddNoticeComponent from '@/components/addNotice/AddNotice';

function AddNoticePage() {
  const router = useRouter();
  const { id } = router.query; // [id] 폴더명에 맞춰 변경

  if (!id || typeof id !== 'string') {
    return <div>Loading...</div>;
  }

  return <AddNoticeComponent shop_id={id} />;
}

export default AddNoticePage;
