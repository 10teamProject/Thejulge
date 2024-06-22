import React from 'react';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

import styles from './Input.module.scss';

interface InputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  type: string;
  placeholder: string;
  register: UseFormRegister<T>;
  error?: string;
}

const Input = <T extends FieldValues>({
  label,
  name,
  type,
  placeholder,
  register,
  error,
}: InputProps<T>) => {
  return (
    <div className={styles.inputGroup}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      <input
        className={styles.input}
        type={type}
        id={name}
        placeholder={placeholder}
        {...register(name)}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default Input;
