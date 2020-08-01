import React from 'react'
import styles from '../styles/App.module.scss'
import LoginForm from '../components/LoginForm'

const index = () => {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <img src={'/logo.png'} className={styles.logo} alt="logo" />
        <p>
          <code>Create carpools, without the headache.</code>
        </p>
      </header>
      <LoginForm />
    </div>
  )
}

export default index

