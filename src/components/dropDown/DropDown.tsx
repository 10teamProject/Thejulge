import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import arrowImg from '@/public/assets/icon/arrow.svg';
import styles from './DropDown.module.scss';

export type Option = {
  value: string;
  label: string;
};

type DropDownProps = {
  className?: string;
  name: string;
  value: string;
  options: Option[];
  onChange: (name: string, value: string) => void;
  errorMessage?: string;
  placeholder?: string;
};

export const categoryOptions = [
  { value: 'korean', label: '한식' },
  { value: 'chinese', label: '중식' },
  { value: 'japanese', label: '일식' },
  { value: 'western', label: '양식' },
  { value: 'snack', label: '분식' },
  { value: 'cafe', label: '카페' },
  { value: 'convenience', label: '편의점' },
  { value: 'etc', label: '기타' },
];

export const addressOptions = [
  { value: 'Jongno-gu', label: '서울시 종로구' },
  { value: 'Jung-gu', label: '서울시 중구' },
  { value: 'Yongsan-gu', label: '서울시 용산구' },
  { value: 'Seongdong-gu', label: '서울시 성동구' },
  { value: 'Gwangjin-gu', label: '서울시 광진구' },
  { value: 'Dongdaemun-gu', label: '서울시 동대문구' },
  { value: 'Jungnang-gu', label: '서울시 중랑구' },
  { value: 'Seongbuk-gu', label: '서울시 성북구' },
  { value: 'Gangbuk-gu', label: '서울시 강북구' },
  { value: 'Dobong-gu', label: '서울시 도봉구' },
  { value: 'Nowon-gu', label: '서울시 노원구' },
  { value: 'Eunpyeong-gu', label: '서울시 은평구' },
  { value: 'Seodaemun-gu', label: '서울시 서대문구' },
  { value: 'Mapo-gu', label: '서울시 마포구' },
  { value: 'Yangcheon-gu', label: '서울시 양천구' },
  { value: 'Gangseo-gu', label: '서울시 강서구' },
  { value: 'Guro-gu', label: '서울시 구로구' },
  { value: 'Geumcheon-gu', label: '서울시 금천구' },
  { value: 'Yeongdeungpo-gu', label: '서울시 영등포구' },
  { value: 'Dongjak-gu', label: '서울시 동작구' },
  { value: 'Gwanak-gu', label: '서울시 관악구' },
  { value: 'Seocho-gu', label: '서울시 서초구' },
  { value: 'Gangnam-gu', label: '서울시 강남구' },
  { value: 'Songpa-gu', label: '서울시 송파구' },
  { value: 'Gangdong-gu', label: '서울시 강동구' },
];

export default function DropDown({
  className,
  name,
  value,
  options,
  onChange,
  placeholder,
}: DropDownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  const handleInputClick = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleBlur = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const isInside = inputRef.current?.contains(e.target as Node);
      if (!isInside) {
        setIsOpen(false);
      }
    }

    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const classNames = `${styles.input} ${isOpen ? styles.opened : ''} ${className}`;
  const selectedOption = options.find((option) => option.value === value);

  return (
    <>
      <div
        className={classNames}
        onClick={handleInputClick}
        onBlur={handleBlur}
        ref={inputRef}
      >
        <span className={!selectedOption ? styles.placeholder : ''}>
          {selectedOption?.label || placeholder}
        </span>
        <Image className={styles.arrow} src={arrowImg} alt="▼" />
        {isOpen && (
          <div className={styles.options}>
            {options.map((option) => {
              const selected = value === option.value;
              const optionClassName = `${styles.option} ${selected ? styles.selected : ''}`;
              return (
                <div
                  className={optionClassName}
                  key={option.value}
                  onClick={() => onChange(name, option.value)}
                >
                  {option.label}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
