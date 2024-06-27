import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';

import {
  createPresignedURL,
  uploadImageToS3,
} from '@/pages/api/PresignedUpload';
import cameraImg from '@/public/assets/icon/icon_camera.svg';

import styles from './ImageUpload.module.scss';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
}

export default function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // presigned Url 생성
        const presignedUrl = await createPresignedURL(file);
        console.log('createPresignedURL', presignedUrl);
        const imageUrl = presignedUrl.split('?')[0];

        // S3에 이미지 업로드
        await uploadImageToS3(presignedUrl, file);

        setImagePreviewUrl(imageUrl);
        onImageUpload(imageUrl);
      } catch (error) {
        console.error('이미지를 업로드하는데 실패했습니다.', error);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  return (
    <>
      <div className={styles.imageUploadContainer}>
        <label htmlFor="imageUpload" className={styles.uploadButton}>
          {imagePreviewUrl ? (
            <div
              className={styles.imagePreview}
              style={{ backgroundImage: `url(${imagePreviewUrl})` }}
            />
          ) : (
            <>
              <Image src={cameraImg} alt="카메라 이미지" />
              이미지 추가하기
            </>
          )}
        </label>
        <input
          id="imageUpload"
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className={styles.hiddenFileInput}
        />
      </div>
    </>
  );
}
