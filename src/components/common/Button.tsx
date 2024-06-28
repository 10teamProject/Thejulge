import { ButtonHTMLAttributes } from 'react';

import styles from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const Button = ({ children, className, disabled, ...rest }: ButtonProps) => {
  return (
    <button
      children={children}
      className={styles.submitButton}
      disabled={disabled}
      {...rest}
    />
  );
};

export default Button;
