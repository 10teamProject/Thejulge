import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import arrowImg from '@/public/assets/icon/arrow.svg';
import { Option } from '@/utils/Options';

import styles from './DropDown.module.scss';

interface DropDownProps {
  className?: string;
  name: string;
  value: string;
  options: Option[];
  onChange: (name: string, value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

const DropDown = ({
  className,
  name,
  value,
  options,
  onChange,
  placeholder,
  required,
  error,
}: DropDownProps) => {
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
          {selectedOption?.value || placeholder}
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
                  {option.value}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {required && error && (
        <span className={styles.errorMessage}>{error}</span>
      )}
    </>
  );
};

export default DropDown;
