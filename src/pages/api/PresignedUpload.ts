import Messages from '@/utils/validation/Message';

import { instance } from './AxiosInstance';

export const createPresignedURL = async (imageUrl: string) => {
  try {
    const response = await instance.post('/images', { imageUrl });
    return response.data.item.url;
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
