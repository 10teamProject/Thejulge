import { useEffect, useState } from 'react';

import { GetApplicantList, Item } from '@/pages/api/GetApplitcantList';

export const useApplicants = (shop_id: string, notice_id: string) => {
  const [applicants, setApplicants] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await GetApplicantList(shop_id, notice_id, {
          shop_id,
          notice_id,
          offset: (currentPage - 1) * ITEMS_PER_PAGE,
          limit: ITEMS_PER_PAGE,
        });
        setApplicants(response.items.map((item) => item.item));
        setTotalPages(Math.ceil(response.count / ITEMS_PER_PAGE));
      } catch (error) {
        console.error('Error fetching applicants:', error);
      }
    };

    fetchApplicants();
  }, [currentPage, shop_id, notice_id]);

  const handleStatusChange = (
    id: string,
    newStatus: 'accepted' | 'rejected',
  ) => {
    console.log(`Changing status of applicant ${id} to ${newStatus}`);
    // @Todo 실제로 변경되게 구현
  };

  return {
    applicants,
    currentPage,
    totalPages,
    setCurrentPage,
    handleStatusChange,
  };
};
