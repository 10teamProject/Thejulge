import Image from 'next/image';
import cameraImg from '@/public/assets/icon/icon_camera.svg';

import styles from './ImageUpload.module.scss';
import { ChangeEvent, useState } from 'react';

export default function ImageUpload() {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreviewUrl(imageUrl);
    }
  };

  return (
    <>
      <div className={styles.imageUploadContainer}>
        <label htmlFor="imageUpload" className={styles.uploadButton}>
          {imagePreviewUrl ? (
            <div
              className={styles.imagePreview}
              style={{ backgroundImage: `url(${imagePreviewUrl})` }}
            ></div>
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
