import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'

// fetch this data here from the database:
const DUMMY_DATA = [
  {
    name: 'Jack',
    destination: {
      address: 'Vancouver',
      latlng: {
        lat: 49,
        lng: 49
      }
    },
    seats: 0
  },
  {
    name: 'Liang',
    destination: {
      address: 'Vancouver',
      latlng: {
        lat: 49,
        lng: 49
      }
    },
    seats: 4
  },
  {
    name: 'Philly',
    destination: {
      address: 'Vancouver',
      latlng: {
        lat: 49,
        lng: 49
      }
    },
    seats: 5
  },
  {
    name: 'Hasan',
    destination: {
      address: 'Vancouver',
      latlng: {
        lat: 49,
        lng: 49
      }
    },
    seats: 3
  },
  {
    name: 'Michael',
    destination: {
      address: 'Vancouver',
      latlng: {
        lat: 49,
        lng: 49
      }
    },
    seats: 0
  },
  {
    name: 'Michael',
    destination: {
      address: 'Vancouver',
      latlng: {
        lat: 49,
        lng: 49
      }
    },
    seats: 0
  },
  {
    name: 'Michael',
    destination: {
      address: 'Vancouver',
      latlng: {
        lat: 49,
        lng: 49
      }
    },
    seats: 0
  },
  {
    name: 'Michael',
    destination: {
      address: 'Vancouver',
      latlng: {
        lat: 49,
        lng: 49
      }
    },
    seats: 0
  }, 
  {
    name: 'Michael',
    destination: {
      address: 'Vancouver',
      latlng: {
        lat: 49,
        lng: 49
      }
    },
    seats: 0
  },
  {
    name: 'Michael',
    destination: {
      address: 'Vancouver',
      latlng: {
        lat: 49,
        lng: 49
      }
    },
    seats: 0
  },
  {
    name: 'Michael',
    destination: {
      address: 'Vancouver',
      latlng: {
        lat: 49,
        lng: 49
      }
    },
    seats: 0
  }
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: '36ch',
      backgroundColor: theme.palette.background.paper
    },
    inline: {
      display: 'inline'
    }
  })
);

const Person = (props: any) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={props.name} src="" />
        </ListItemAvatar>
        <ListItemText
          primary={props.name}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                {props.address + '  -  '}
              </Typography>
              {props.seats === 0
                ? 'Passenger'
                : 'Seats: ' + String(props.seats)}
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </React.Fragment>
  );
};

export default function ListView(props: any) {
  const classes = useStyles();
  const y = window.innerHeight * 0.8
  return (
      <div style = {{textAlign: "center"}}>
        <List className={classes.root} style={{height: String(y) + "px", overflow: 'auto'}}>
        {props.members.map((person: any) => (
            <Person
            key={person.name}
            seats={person.seats}
            name={person.name}
            address={person.location.address}
            />
        ))}
        {props.members.length === 0 && <h2 style = {{marginLeft: "37px", marginRight: "37px"}}> No members yet </h2>}
        </List>
        <br></br>
        <Button variant="contained" color="secondary">
            Find optimal route
        </Button>
     </div>
  );
}
