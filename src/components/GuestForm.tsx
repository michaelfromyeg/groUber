import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import * as firebase from 'firebase';
import { useParams } from 'react-router-dom';
import useAutoCompletePlaces from '../hooks/UseAutocompletePlaces';
import { Collapse, CircularProgress } from '@material-ui/core';
import { useDocument, useCollectionData } from 'react-firebase-hooks/firestore';
import { Event } from '../_types/event';
import 'firebase/auth';
import { People } from 'src/_types/people';
import throttle from 'lodash/throttle';

const autocompleteService: any = { current: null };

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
    const db = firebase.firestore();
    const { eventId } = useParams();
    const [host, setHost] = useState<People>(null);

    const [event, loading] = useDocument(firebase.firestore().collection('events').doc(eventId), {
        snapshotListenOptions: {
            includeMetadataChanges: true,
        },
    });

    const [address, latlng, AutoCompletePlaces, setLatLng, setInputValue, setValue] = useAutoCompletePlaces(
        'Add Your Location',
    );
    const [seats, setSeats] = useState('0');
    const [submitted, setSubmit] = useState<boolean>(false);

    const [checked, setChecked] = React.useState(false);

    const eventData: Event = event?.data() as Event;
    useEffect(() => {
        const eventHost = eventData?.host as firebase.firestore.DocumentReference;
        eventHost?.get()?.then((host) => {
            setHost(host.data() as People);
        });
        if (event?.ref) {
            db.collection('people')
                .where('userId', '==', firebase.auth().currentUser.uid)
                .where('event', '==', event.ref)
                .get()
                .then((data) => {
                    const oldData: People = data.docs[0].data() as People;
                    new (window as any).google.maps.places.AutocompleteService().getPlacePredictions(
                        { input: String(oldData?.location?.address) },
                        (results?: PlaceType[]) => {
                            setValue(results[0]);
                        },
                    );
                    setInputValue(oldData?.location?.address);
                    setLatLng(oldData?.location?.latlng);
                    setChecked(oldData?.canDrive);
                    setSeats(String(oldData?.seats || 0));
                });
        }
    }, [event]);

    const currentUser = firebase.auth().currentUser;
    async function handleSubmit(e: any) {
        e.preventDefault();
        const exists = await db
            .collection('people')
            .where('userId', '==', firebase.auth().currentUser.uid)
            .where('event', '==', event.ref)
            .get();
        if (exists.docs.length > 0) {
            exists.docs[0].ref.update({
                canDrive: checked,
                seats: checked ? Number(seats) : 0,
                location: {
                    latlng,
                    address,
                },
            });
        } else {
            const result = await db.collection('people').add({
                name: currentUser.displayName,
                email: currentUser.email,
                profilePicture: currentUser.photoURL,
                userId: currentUser.uid,
                canDrive: checked,
                seats: checked ? Number(seats) : 0,
                location: {
                    latlng,
                    address,
                },
                event: event.ref,
            });
            await event.ref.update({
                people: firebase.firestore.FieldValue.arrayUnion(result),
            });
        }
        setSubmit(true);
    }

    return (
        <>
            {loading ? (
                <CircularProgress />
            ) : !submitted ? (
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Typography component="h1" variant="h5">
                            {host?.name} is inviting you to attend {eventData?.name}.
                        </Typography>
                        <br />
                        <Typography component="h1" variant="h5">
                            This event is at {eventData?.destination?.address}.
                            <br />
                            <br />
                            It is happening on {new Date((eventData?.date as any)?.seconds * 1000).toString()}.
                        </Typography>
                        <br />
                        <Typography component="h3" variant="h6">
                            You are RSVPing as: {currentUser?.displayName} ({currentUser?.email})
                        </Typography>
                        <br />
                        <form className={classes.form} onSubmit={handleSubmit}>
                            <Typography component="h3" variant="h6">
                                Where are you coming from?
                            </Typography>
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
                                    label="Number of Seats Available"
                                    type="number"
                                    fullWidth
                                    value={seats}
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
