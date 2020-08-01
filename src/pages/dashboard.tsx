import React, { useState } from 'react'
import * as firebase from 'firebase';
import { Event } from '../_types/event'
import { useParams, useHistory } from 'react-router-dom';
import { useDocument } from 'react-firebase-hooks/firestore';
import { AppBar, Toolbar, IconButton, Typography, Button, makeStyles } from '@material-ui/core'
import classes from '*.module.css'
import BackIcon from '@material-ui/icons/ArrowBackIosRounded'
import Map from '../components/Map'

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2)
  }
}))

//eslint-disable-next-line
const globalAny: any = global
// some shit
const DashBoard = () => {

  const classes = useStyles()
  const { eventId } = useParams();
  const history = useHistory();

  const [value, loading, error] = useDocument(
    firebase.firestore().collection("events").doc(eventId),
    {
      snapshotListenOptions: {
        includeMetadataChanges: true
      }
    }
  );

  if (!loading && !value?.data()) {
    globalAny.setNotification('error', 'Event not found.')
    history.push('/')
  }

  const event = value?.data()
  
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
              history.push('/')
            }}
          >
            <BackIcon />
          </IconButton>
          <Typography variant="h6">
            groUber
          </Typography>
        </Toolbar>
      </AppBar>

        

    </>
  );
}

export default DashBoard;