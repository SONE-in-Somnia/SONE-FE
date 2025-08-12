import React from 'react';
import styles from '../styles/MatrixText.module.css';

interface MatrixTextProps {
  text: string;
}

const MatrixText: React.FC<MatrixTextProps> = ({ text }) => {
  return (
    <div className={styles.container}>
      <div className={styles['matrix-container']}>
        <div className={styles.rain}></div>
        <div className={styles['matrix-text']} data-text={text}>
          {text}
        </div>
      </div>
    </div>
  );
};

export default MatrixText;
