import React from 'react';
import styles from '../styles/App.module.scss';

const index = () => {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <img src={'/logo.png'} className={styles.logo} alt="logo" />
        <p>
          <code>console.log(Hello, world!)</code>
        </p>
      </header>
    </div>
  );
}

export default index;
