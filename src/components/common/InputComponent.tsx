import React, { ChangeEvent, FocusEvent, KeyboardEvent } from 'react';

import styles from '../auth/Input.module.scss';

export interface InputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isTextArea?: boolean;
  required?: boolean;
  error?: string;
  autoComplete?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  onKeyDown,
  onBlur,
  isTextArea,
  required,
  error,
  autoComplete = 'off',
}) => {
  return (
    <div className={styles.inputGroup}>
      <label className={styles.label} htmlFor={name}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      {isTextArea ? (
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      ) : (
        <input
          className={`${styles.input} ${styles.storeRegisterInput}`}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          autoComplete={autoComplete}
        />
      )}
      {required && error && (
        <span className={styles.errorMessage}>{error}</span>
      )}
    </div>
  );
};

export default Input;
