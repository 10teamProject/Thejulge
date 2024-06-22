import React from 'react';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

import styles from './RadioButton.module.scss';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  options: RadioOption[];
  register: UseFormRegister<T>;
  error?: string;
}

const RadioGroup = <T extends FieldValues>({
  label,
  name,
  options,
  register,
  error,
}: RadioGroupProps<T>) => {
  return (
    <div className={styles.inputGroup}>
      <span className={styles.label}>{label}</span>
      <div className={styles.radioGroup}>
        {options.map((option) => (
          <label key={option.value} className={styles.radioLabel}>
            <input
              className={styles.radioInput}
              type="radio"
              value={option.value}
              {...register(name)}
            />
            <span className={styles.radioButton}>{option.label}</span>
          </label>
        ))}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default RadioGroup;
