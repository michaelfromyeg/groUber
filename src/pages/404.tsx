import React from 'react';
import styles from '../styles/App.module.scss';
import { Link } from 'react-router-dom';

const index = () => {
    return (
        <div className={styles.app}>
            <header className={styles.header}>
                <img src={'/logo.png'} className={styles.logo} alt="logo" />
                <p>
                    Page not found. Sorry :(
                    <br />
                    Click here to go back <Link to="/">home</Link>.
                </p>
            </header>
        </div>
    );
};

export default index;
