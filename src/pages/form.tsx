import React from 'react';
import styles from '../styles/App.module.scss';
import GuestForm from '../components/GuestForm';
import { Grid, Hidden } from '@material-ui/core';

const Form = () => {
    return (
        <div className={styles.app}>
            <Grid container>
                <Grid item xs={12} lg={6}>
                    <div style={{ margin: 'auto' }}>
                        <header className={styles.app}>
                            <img src={'/logo.png'} className={styles.logo} alt="logo" />
                            <p>
                                <code>Create carpools, without the headache.</code>
                            </p>
                        </header>
                        <GuestForm />
                    </div>
                </Grid>
                <Hidden mdDown>
                    <Grid
                        container
                        lg={6}
                        style={{
                            // eslint-disable-next-line @typescript-eslint/quotes
                            background: "url('/login_art.png')",
                            height: '100vh',
                            backgroundSize: 'cover',
                            backgroundPositionY: '80%',
                            position: 'fixed',
                            right: 0,
                        }}
                    />
                </Hidden>
            </Grid>
        </div>
    );
};

export default Form;
