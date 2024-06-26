import Cookies from 'js-cookie';

import Messages from '@/utils/validation/Message';

import { instance } from './AxiosInstance';

interface Item {
  url: string;
}

interface Link {
  href: string;
  rel: string;
  description: string;
  method: string;
  body: {
    file: string;
  };
}

interface PresignedURLResponse {
  item: Item;
  links: Link[];
}

export const createPresignedURL = async (file: File) => {
  try {
    const response = await instance.post<PresignedURLResponse>(
      '/images',
      { name: file.name },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      },
    );
    const presignedUrl = response.data.item.url;
    return presignedUrl;
  } catch (error) {
    console.error(Messages.ERROR_PRE_SIGNED_URL_CREATION, error);
    throw new Error(Messages.ERROR_PRE_SIGNED_URL_FAILED);
  }
};

export const uploadImageToS3 = async (presignedUrl: string, file: File) => {
  try {
    await instance.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
  } catch (error) {
    console.error(Messages.ERROR_S3_UPLOAD, error);
    throw new Error(Messages.ERROR_S3_UPLOAD_FAILED);
  }
};
