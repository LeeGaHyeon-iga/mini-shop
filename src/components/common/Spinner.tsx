import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function Spinner({ size = 'medium', className = '' }: SpinnerProps) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={`${styles.spinner} ${styles[size]}`} />
    </div>
  );
}
