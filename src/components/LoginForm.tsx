import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import * as firebase from 'firebase';
import 'firebase/auth';

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
                            .then((result) => {
                                result.user.getIdToken().then((x) => console.log(x));
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
