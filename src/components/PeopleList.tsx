import React from 'react';
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

export default function ListView(props: any) {
    const { eventId } = useParams();
    const classes = useStyles();
    const y = window.innerHeight * 0.6;
    const members: People[] = props.members;

    return (
        <div style={{ textAlign: 'center' }}>
            <List className={classes.root} style={{ maxHeight: String(y) + 'px', overflow: 'auto' }}>
                {members.map((person: People) => (
                    <Person key={person.name} person={person} />
                ))}
                {members.length === 0 && <h2 style={{ marginLeft: '37px', marginRight: '37px' }}> No members yet </h2>}
            </List>
            <br></br>
            <Button variant="contained" color="secondary">
                Find optimal route
            </Button>

            <br></br>
            <br></br>

            <Button variant="contained" color="primary" component={Link} to={`/event/${eventId}/form`}>
                {' '}
                I am not at the event{' '}
            </Button>
            <br></br>
            <br></br>
            <LinkDisplay link={`https://grouper.online/event/${eventId}/form`} />
        </div>
    );
}
