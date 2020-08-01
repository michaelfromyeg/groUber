import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import * as firebase from 'firebase';
import { Event } from '../_types/event'
import { useParams, useHistory } from 'react-router-dom';
import { useDocument } from 'react-firebase-hooks/firestore';

const useStyles = makeStyles({
  root: {
    minWidth: 475,
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

// const [value, loading, error] = useDocument(
//     firebase.firestore().collection("events").doc(eventId),
//     {
//       snapshotListenOptions: {
//         includeMetadataChanges: true
//       }
//     }
//   );


export default function SimpleCard() {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Name : 
        </Typography>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Address: 
        </Typography>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Seats: 
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Kick This Motherfucker</Button>
      </CardActions>
    </Card>
  );
}