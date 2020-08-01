import React, { ReactElement } from 'react';
import styles from '../styles/App.module.scss';
import LoginForm from '../components/LoginForm';
import { Grid, Hidden } from '@material-ui/core';

const index = (): ReactElement => {
    return (
        <div className={styles.app}>
            <Grid container spacing={1}>
                <Grid item xs={12} lg={6}>
                    <div style={{ margin: 'auto' }}>
                        <header className={styles.app}>
                            <img src={'/logo.png'} className={styles.logo} alt="logo" />
                            <p>
                                <code>Create carpools, without the headache.</code>
                            </p>
                        </header>
                    </div>
                    <LoginForm />
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
                        }}
                    >
                        {/* <img
              src="/login_art.png"
              style={{ width: 'auto', height: '100vh' }}
            /> */}
                    </Grid>
                </Hidden>
            </Grid>
        </div>
    );
};

export default index;
