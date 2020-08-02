import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { Container } from '@material-ui/core';
import * as firebase from 'firebase';

const useStyles = makeStyles({
    root: {
        minWidth: 200,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

export default function DemoCard() {
    const classes = useStyles();
    const eventId = 'NI4yopwnFbu3sbZNbRTa';

    return (
        <Container>
            <Card className={classes.root}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        Want to try out a demo?
                        <br />
                        <br />
                        <Button
                            size="small"
                            onClick={() => {
                                window.localStorage.setItem('location', '/event/NI4yopwnFbu3sbZNbRTa/dashboard');
                                firebase.auth().signInWithEmailAndPassword('test@test.test', '111111');
                            }}
                        >
                            Click Here!
                        </Button>
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
}
