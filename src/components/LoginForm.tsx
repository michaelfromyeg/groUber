import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import * as firebase from 'firebase';
import 'firebase/auth';
import { useHistory } from 'react-router-dom';

//eslint-disable-next-line
const globalAny: any = global

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function LoginForm() {
    const classes = useStyles();
    const history = useHistory();
    const provider = new firebase.auth.GoogleAuthProvider();

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={() => {
                        firebase
                            .auth()
                            .signInWithPopup(provider)
                            .then(function (result) {
                                // This gives you a Google Access Token. You can use it to access the Google API.
                                const token = (result.credential as any).accessToken;
                                // The signed-in user info.
                                const user = result.user;
                                console.log(user.uid);
                                globalAny.setNotification('success', 'Successfully Logged In!');
                            })
                            .catch(() => {
                                globalAny.setNotification('error', 'Unable to login. Please try again later.');
                            });
                    }}
                >
                    Login with Google
                </Button>
            </div>
            <Box mt={8}></Box>
        </Container>
    );
}

export default LoginForm;
