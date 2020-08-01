import React, { useState } from 'react';
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
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as firebase from 'firebase';
import { useHistory, useParams } from 'react-router-dom';
import PlacesAutocomplete, { geocodeByAddress, getLatLng, Suggestion } from 'react-places-autocomplete';
import useAutoCompletePlaces from '../hooks/UseAutocompletePlaces';
import { Radio, Collapse } from '@material-ui/core';
import { useDocument } from 'react-firebase-hooks/firestore';

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

function GuestForm() {
    const classes = useStyles();
    const history = useHistory();
    const db = firebase.firestore();
    const { eventId } = useParams();

    const [event, loading, error] = useDocument(firebase.firestore().collection('events').doc(eventId), {
        snapshotListenOptions: {
            includeMetadataChanges: true,
        },
    });

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, latlng, AutoCompletePlaces] = useAutoCompletePlaces('Add Your Location');
    const [seats, setSeats] = useState('0');
    const [submitted, setSubmit] = useState<boolean>(false);

    const [checked, setChecked] = React.useState(false);

    async function handleSubmit(e: any) {
        e.preventDefault();
        const result = await db.collection('people').add({
            name,
            location: {
                address,
                latlng,
            },
            canDrive: checked,
            email,
            seats: checked ? Number(seats) : 0,
            event: event.ref,
        });

        console.log(result);

        await event.ref.update({
            people: firebase.firestore.FieldValue.arrayUnion(result),
        });

        setSubmit(true);
    }

    return (
        <>
            {!submitted ? (
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Typography component="h1" variant="h5">
                            Submit Your Information
                        </Typography>
                        <form className={classes.form} onSubmit={handleSubmit}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="event-name"
                                label="Name"
                                name="Name"
                                autoFocus
                                onChange={(e) => setName(e.target.value)}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="Guest Email"
                                label="Guest Email"
                                id="email"
                                autoComplete="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {AutoCompletePlaces}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={() => {
                                            setChecked(!checked);
                                        }}
                                        name="isDriver"
                                    />
                                }
                                label="Are you Driving?"
                            />
                            <Collapse in={checked}>
                                <TextField
                                    id="standard-number"
                                    label="Number"
                                    type="number"
                                    fullWidth
                                    onChange={(e) => setSeats(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Collapse>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Submit
                            </Button>
                        </form>
                    </div>
                    <Box mt={8}></Box>
                </Container>
            ) : (
                <code>Form Submitted!</code>
            )}
        </>
    );
}

interface PlaceType {
    description: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
        main_text_matched_substrings: [
            {
                offset: number;
                length: number;
            },
        ];
    };
}

export default GuestForm;
