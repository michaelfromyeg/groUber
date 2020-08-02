import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom'


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
  const eventId = 'NI4yopwnFbu3sbZNbRTa'


  return (
    <Card className={classes.root}>
      <CardContent>

        <Typography variant="h5" component="h2">
          Want to try out a demo? <br /> 
          <Button size="small" component = {Link} to = {`/event/${eventId}/dashboard`}>Click Here!</Button>
        </Typography>
      </CardContent>
    </Card>
  );
}
