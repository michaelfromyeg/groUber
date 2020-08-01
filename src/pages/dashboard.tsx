import React, { useState } from 'react';
import * as firebase from 'firebase';
import { Event } from '../_types/event';
import { useParams, useHistory } from 'react-router-dom';
import { useDocument } from 'react-firebase-hooks/firestore';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  makeStyles
} from '@material-ui/core';
import classes from '*.module.css';
import BackIcon from '@material-ui/icons/ArrowBackIosRounded';
import Map from '../components/Map';
import ListView from '../components/ListView';
import useEventPeople from 'src/hooks/useEventPeople';


const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2)
  }
}));

//eslint-disable-next-line
const globalAny: any = global
// some shit
const DashBoard = () => {
  const classes = useStyles();
  const { eventId } = useParams();
  const history = useHistory();
  const [coord, setCoord] = useState({
    lat: 0.0,
    lng: 0.0
  });

  const [value, loading, error] = useDocument(
    firebase.firestore().collection('events').doc(eventId),
    {
      snapshotListenOptions: {
        includeMetadataChanges: true
      }
    }
  );
  const people = useEventPeople(eventId);

  if (!loading && !value?.data()) {
    globalAny.setNotification('error', 'Event not found.');
    history.push('/');
  }

  const event = value?.data()  

  React.useEffect(() => {
    const showPosition = (position: any) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      console.log(lat, lng);
      setCoord({
        lat: lat,
        lng: lng
      });
    };

    // get user current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      // eslint-disable-next-line @typescript-eslint/quotes
      alert("your browser doesn't support maps");
    }
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => {
              history.push('/');
            }}
          >
            <BackIcon />
          </IconButton>
          <Typography variant="h6">groUber</Typography>
        </Toolbar>
      </AppBar>
      <div style={{ display: 'flex' }}>
        {/* Load map */}
        <Map center={coord} />
        {/* Load side-menu */}
        <ListView />
      </div>
    </>
  );
};

export default DashBoard;
