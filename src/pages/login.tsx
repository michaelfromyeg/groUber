import React, { ReactElement } from 'react';
import styles from '../styles/App.module.scss';
import LoginForm from '../components/LoginForm';
import { Grid, Hidden } from '@material-ui/core';
import  DemoCard  from '../components/DemoCard';

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
                    
                <DemoCard />
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
                    />
                </Hidden>

            </Grid>
        </div>
    );
};

export default index;
