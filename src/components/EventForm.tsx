import 'luxon';
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import * as firebase from 'firebase';
import 'firebase/auth';
import { useHistory } from 'react-router-dom';
import useAutoCompletePlaces from '../hooks/UseAutocompletePlaces';
import LuxonUtils from '@date-io/luxon';
import { DateTime } from 'luxon';
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers';

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

function EventForm() {
    const classes = useStyles();
    const history = useHistory();
    const db = firebase.firestore();

    const [eventName, setName] = useState('');
    const [selectedDate, handleDateChange] = useState<DateTime>(null);

    const [address, latlng, AutoCompletePlaces] = useAutoCompletePlaces('Add the Destination Address');

    const currentUser = firebase.auth().currentUser;

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h3" variant="h6">
                    You are making this event as: {currentUser?.displayName} ({currentUser?.email})
                </Typography>
                <br />
                <Typography component="h1" variant="h5">
                    Enter Event Details!
                </Typography>
                <form
                    className={classes.form}
                    onSubmit={async (e) => {
                        e.preventDefault();
                        const result = await db.collection('people').add({
                            name: currentUser.displayName,
                            email: currentUser.email,
                            profilePicture: currentUser.photoURL,
                            userId: currentUser.uid,
                            canDrive: false,
                            seats: 0,
                            isHost: true,
                            location: {
                                latlng,
                                address,
                            },
                        });
                        console.log(selectedDate);
                        const eventRef = await db.collection('events').add({
                            name: eventName,
                            host: (await result.get()).ref,
                            people: [],
                            date: firebase.firestore.Timestamp.fromDate(selectedDate?.toJSDate()),
                            destination: {
                                latlng,
                                address,
                            },
                        });
                        result.update({
                            event: (await eventRef.get()).ref,
                        });
                        history.push(`/event/${eventRef.id}/dashboard`);
                    }}
                >
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="event-name"
                        label="Event Name"
                        name="Event Name"
                        autoFocus
                        onChange={(e) => setName(e.target.value)}
                    />
                    <MuiPickersUtilsProvider utils={LuxonUtils}>
                        <KeyboardDateTimePicker
                            inputVariant="outlined"
                            margin="normal"
                            fullWidth
                            ampm={false}
                            label="Event Date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            onError={console.error}
                            disablePast
                            format="yyyy/MM/dd HH:mm"
                        />
                    </MuiPickersUtilsProvider>
                    {AutoCompletePlaces}
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        Create New Event
                    </Button>
                </form>
            </div>
            <Box mt={8}></Box>
        </Container>
    );
}

export default EventForm;
