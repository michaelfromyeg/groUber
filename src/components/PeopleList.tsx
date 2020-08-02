import React, { useState } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { People } from '../_types/people';
import { Link, useParams } from 'react-router-dom';
import LinkDisplay from '../components/LinkDisplay';
import { IconButton, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import * as firebase from 'firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useFetch } from 'src/hooks/UseFetch';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            maxWidth: '36ch',
            backgroundColor: theme.palette.background.paper,
        },
        inline: {
            display: 'inline',
        },
        toolbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
        },
        nested: {
            paddingLeft: theme.spacing(4),
        },
    }),
);

const Person = ({ person }: { person: People }) => {
    const classes = useStyles();
    return (
        <React.Fragment>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar alt={person.name} src={person?.profilePicture || null} />
                </ListItemAvatar>
                <ListItemText
                    primary={`${person.name}${person?.isHost ? ' (is host)' : ''}`}
                    secondary={
                        <React.Fragment>
                            <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">
                                {person.location.address + '  -  '}
                            </Typography>
                            {person.seats === 0 ? 'Passenger' : 'Seats: ' + String(person.seats)}
                        </React.Fragment>
                    }
                />
            </ListItem>
            <Divider variant="inset" component="li" />
        </React.Fragment>
    );
};

const Passenger = ({ personId }: { personId: string }) => {
    const classes = useStyles();
    const [person] = useDocumentData<People>(firebase.firestore().collection('people').doc(personId), {
        snapshotListenOptions: {
            includeMetadataChanges: true,
        },
    });
    return (
        <React.Fragment>
            <ListItem alignItems="flex-start" className={classes.nested}>
                <ListItemAvatar>
                    <Avatar alt={person?.name} src={person?.profilePicture || null} />
                </ListItemAvatar>
                <ListItemText primary={`👤 ${person?.name}`} secondary={'Passenger'} />
            </ListItem>
            <Divider variant="inset" component="li" />
        </React.Fragment>
    );
};

const Driver = ({ personId, passengerIds }: { personId: string; passengerIds: string[] }) => {
    const [person] = useDocumentData<People>(firebase.firestore().collection('people').doc(personId), {
        snapshotListenOptions: {
            includeMetadataChanges: true,
        },
    });
    return (
        <React.Fragment>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar alt={person?.name} src={person?.profilePicture || null} />
                </ListItemAvatar>
                <ListItemText primary={`🚗 ${person?.name}`} secondary={`Driver (${passengerIds.length} passengers)`} />
            </ListItem>
            <Divider variant="inset" component="li" />
            <List>
                {passengerIds?.map((passengerId) => (
                    <Passenger key={passengerId} personId={passengerId} />
                ))}
            </List>
        </React.Fragment>
    );
};

export default function ListView(props: any) {
    const { eventId } = useParams();
    const classes = useStyles();
    const y = window.innerHeight * 0.6;
    const members: People[] = props.members;
    const [showResult, setShowResult] = useState(false);

    const result = useFetch(`https://us-central1-find-my-carpool.cloudfunctions.net/solve?eventId=${eventId}`);

    return (
        <div style={{ textAlign: 'center' }}>
            <List className={classes.root} style={{ maxHeight: String(y) + 'px', overflow: 'auto' }}>
                <div className={classes.toolbar}>
                    <IconButton
                        onClick={() => {
                            props?.setSidebarOpen(false);
                        }}
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                {members.map((person: People) => (
                    <Person key={person.name} person={person} />
                ))}
                {members.length === 0 && <h2 style={{ marginLeft: '37px', marginRight: '37px' }}> No members yet </h2>}
            </List>
            <br />
            <Button variant="contained" color="secondary">
                Find optimal route
            </Button>
            <br />
            <br />
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    setShowResult(true);
                }}
            >
                Show Assignments
            </Button>
            <br />
            <br />
            <Button variant="contained" color="primary" component={Link} to={`/event/${eventId}/form`}>
                {' '}
                I am not at the event{' '}
            </Button>
            <br />
            <br />
            <LinkDisplay link={`https://grouber.online/event/${eventId}/form`} />
            <Dialog onClose={() => setShowResult(false)} aria-labelledby="customized-dialog-title" open={showResult}>
                <DialogTitle id="customized-dialog-title">Assignments</DialogTitle>
                <DialogContent dividers>
                    <List className={classes.root} style={{ maxHeight: String(y) + 'px', overflow: 'auto' }}>
                        {Boolean(!result.loading && result.data) &&
                            Object.keys(result?.data).map((driverId) => (
                                <Driver key={driverId} personId={driverId} passengerIds={result?.data[driverId]} />
                            ))}
                    </List>
                </DialogContent>
            </Dialog>
        </div>
    );
}
