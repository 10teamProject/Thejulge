import { useEffect, useState } from 'react';

import { updateApplicationStatus } from '@/pages/api/ApplicationStatus';
import {
  GetApplicantList,
  Item,
  ResponseType,
} from '@/pages/api/GetApplitcantList';

export const useApplicants = (shop_id: string, notice_id: string) => {
  const [applicants, setApplicants] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response: ResponseType = await GetApplicantList(
          shop_id,
          notice_id,
          {
            shop_id,
            notice_id,
            offset: (currentPage - 1) * ITEMS_PER_PAGE,
            limit: ITEMS_PER_PAGE,
          },
        );
        setApplicants(response.items.map((item) => item.item));
        setTotalPages(Math.ceil(response.count / ITEMS_PER_PAGE));
      } catch (error) {
        console.error('Error fetching applicants:', error);
      }
    };

    fetchApplicants();
  }, [currentPage, shop_id, notice_id]);

  const handleStatusChange = async (
    id: string,
    newStatus: 'accepted' | 'rejected',
  ) => {
    try {
      await updateApplicationStatus(shop_id, notice_id, id, newStatus);

      setApplicants((prevApplicants) =>
        prevApplicants.map((applicant) =>
          applicant.id === id ? { ...applicant, status: newStatus } : applicant,
        ),
      );

      console.log(
        `Successfully changed status of applicant ${id} to ${newStatus}`,
      );
    } catch (error) {
      console.error('Error updating applicant status:', error);
    }
  };

  return {
    applicants,
    currentPage,
    totalPages,
    setCurrentPage,
    handleStatusChange,
  };
};
