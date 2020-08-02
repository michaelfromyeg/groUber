import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import { useHistory } from 'react-router-dom';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    card: {
        position: 'relative',
        width: 300,
        height: 300,
        padding: theme.spacing(2),
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    actions: {
        position: 'absolute',
        bottom: 2,
        left: 2,
    },
}));

const Event = (props: any) => {
    const history = useHistory();
    const classes = useStyles();
    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    May 25, 2020
                </Typography>
                <Typography variant="h5" component="h2">
                    {props.name}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                    {props.destination}
                </Typography>
                <Typography variant="body2" component="p">
                    This is an event description, some helper text, or something similar.
                </Typography>
            </CardContent>
            <CardActions className={classes.actions}>
                <Button
                    size="small"
                    onClick={() => {
                        history.push(`/event/${props.id}/dashboard`);
                    }}
                >
                    Head to event page
                </Button>
            </CardActions>
        </Card>
    );
};

const EventList = (props: any) => {
    console.log(props.eventList);
    return (
        <Grid container justify="space-around">
            {props.eventList.map((event: any, index: any) => (
                <Grid key={index} item>
                    <Event destination={event.destination.address} name={event.name} key={index} id={event.id} />
                </Grid>
            ))}
        </Grid>
    );
};

export default EventList;
