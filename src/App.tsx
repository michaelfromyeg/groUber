import React from 'react';
import logo from './logo.png';
import styles from './App.module.scss';

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <img src={logo} className={styles.logo} alt="logo" />
        <p>
          <code>console.log(Hello, world!)</code>
        </p>
      </header>
    </div>
  );
}

export default App;
