import Link from 'next/link';

import styles from './Button.module.scss';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  as?: React.ElementType;
  href?: string;
  size?: 'full' | 'large' | 'medium' | 'small';
  bordered?: boolean;
}

const Button = ({
  children,
  className,
  disabled,
  as: Component = 'button',
  href,
  size = 'large',
  bordered = false,
  ...rest
}: ButtonProps) => {
  const buttonClasses = [
    styles.button,
    styles[size],
    bordered && styles.borderStyle,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (href) {
    return (
      <Link
        children={children}
        className={buttonClasses}
        href={href}
        {...rest}
      />
    );
  }
  return (
    <button
      children={children}
      className={buttonClasses}
      disabled={disabled}
      {...rest}
    />
  );
};

export default Button;
